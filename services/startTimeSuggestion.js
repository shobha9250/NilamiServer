/* This file containes the algorithm that suggests the start time while creating the auction.*/

const db = require('./db');

// Comparision function for sorting the filtered auction objects
function comp(a, b) {
    if (a.start_time < b.start_time) {
        return true;
    }
    else if (b.start_time > a.start_time) {
        return false;
    }
    if (a.end_time < b.end_time) {
        return true;
    }
    return false;
}

async function startTimeSuggestion(req, res, next) {
    try {

        // Fetching all the auctions from the database
        let feedQuery = `SELECT * 
						FROM auction 
						INNER JOIN product ON auction.product_id=product.product_id 
						ORDER BY n_likes DESC,n_bidders DESC`;
        const allAuctions = await db.query(feedQuery);
        
        // Extracting the arguments 
        var freeStartDate = new Date(req.body.freeStartDate + ' ' + req.body.freeStartTime);
        var freeEndDate = new Date(req.body.freeEndDate + ' ' + req.body.freeEndTime);
        var estimated_price = req.body.estimatedPrice;
        var category = req.body.category;
        var city = req.body.city;
        var duration = req.body.duration; // duration is in seconds

        // stores filtered auctions i.e relavant auctions for the given arguments
        const filteredAuctions = []; 
        var j = 0;

        // Iterating over all the fetched auctions
        allAuctions.forEach(auction => {

            // Converting the start_date, start_time to Date type
            var tempString = auction.start_date;
            var tempTimeStampString = tempString.toString();
            var i = 0;
            while (i < tempTimeStampString.length && tempTimeStampString[i] != ' ') {
                i++;
            }
            i++;
            var currAuctionStartDate = new Date(tempTimeStampString.substr(i, 11) + ' ' + auction.start_time);
            
            // Converting the end_date, end_time to Date type
            tempString = auction.end_date;
            tempTimeStampString = tempString.toString();
            i = 0;
            while (i < tempTimeStampString.length && tempTimeStampString[i] != ' ') {
                i++;
            }
            i++;
            var currAuctionEndDate = new Date(tempTimeStampString.substr(i, 11) + ' ' + auction.end_time);

            // 1. Check if the auction intersects with given available period
            // 2. Check if the auction is in same category, city as given in the argument
            // 3. Only considered the auctions which are near the given estimate price i.e +- 10000
            if (estimated_price - 10000 <= auction.estimated_price 
                && estimated_price + 10000 >= auction.estimated_price 
                && category == auction.category 
                && city == auction.city 
                && !(currAuctionStartDate >= freeEndDate || currAuctionEndDate <= startDate)) {
                filteredAuctions[j] = { start_time: currAuctionStartDate, end_time: currAuctionEndDate };
                j++;
            }
        });

        // Sorting the auctions based on start_time i.e auction start_date + auction start_time
        filteredAuctions.sort(comp); 
        var temp = new Date (freeStartDate);
        temp.setSeconds(temp.getSeconds() + duration);

        // Check if the new auction can fit before the first filtered auction
        if (j == 0 || filteredAuctions[0].start_time >= temp) {
            var ans = new Date(freeStartDate).toLocaleString(undefined, {timeZone: 'Asia/Kolkata'});
            return ans;
        }
        else{
            temp = new Date (filteredAuctions[j - 1].end_time);
            temp.setSeconds(temp.getSeconds() + duration);
            // Check if the new auction can fit after the last filtered auction
            if (temp <= freeEndDate) {
                var ans = new Date(max(filteredAuctions[j - 1].end_time, freeStartDate))
                          .toLocaleString(undefined, {timeZone: 'Asia/Kolkata'});
                return ans;
            }
        }


        var ind = -1;
        var k1 = 0;
        var k2 = 0;
        var interections = j + 1;
        // Using two pointer method to find start time for new auction 
        //such that it intersects with minimum number of auctions
        while (k1 < j) {
            if (k1 < j - 1) {
                if ((filteredAuctions[k1 + 1].start_time - filteredAuctions[k1].end_time)/1000 >= duration) {
                    var ans = new Date(filteredAuctions[k1].end_time)
                              .toLocaleString(undefined, {timeZone: 'Asia/Kolkata'});
                    return ans;
                }
            }
            k2 = max(k1, k2);
            while (k2 < j) {
                temp = new Date (max(filteredAuctions[k1].start_time, freeStartDate));
                temp.setSeconds(temp.getSeconds() + duration);
                // Check if new auction can fit between two auctions
                if (filteredAuctions[k2].start_time >= temp) {
                    break;
                }
                k2++;
            }
            if (k2 - k1 < interections) {
                interections = k2 - k1;
                ind = k1;
            }
            k1++;
        }
        var ans = new Date(max(filteredAuctions[ind].start_time, freeStartDate))
                  .toLocaleString(undefined, {timeZone: 'Asia/Kolkata'});
        return ans;
    } catch (err) {
        // Display and return error
        console.error(`Error inside suggestion function: `, err);
        return res.json({err});
    }
}

module.exports = {
    startTimeSuggestion
}