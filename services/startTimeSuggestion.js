const db = require('./db');

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
    
    // var t = new Date('2038-01-20 03:14:27');
    // console.log(t);
    // t.setSeconds(t.getSeconds() + 33);
    // console.log("Babitha");
    // console.log(t);

    // var d2 = new Date('2038-01-19 03:14:07');
    // var d1 = new Date('2038-01-19 03:10:07');

    // var seconds = (d2 - d1) / 1000;
    // console.log("Babitha")
    // console.log(seconds);

    console.log('Suggesting start time');
    try {
        let feedQuery = `SELECT * 
						FROM auction 
						INNER JOIN product ON auction.product_id=product.product_id 
						ORDER BY n_likes DESC,n_bidders DESC`;
        const allAuctions = await db.query(feedQuery);
        console.log(allAuctions);
        console.log("feed brought in!");
        
        var startDate = new Date(req.body.start_date + ' ' + req.body.start_time);
        var endDate = new Date(req.body.end_date + ' ' + req.body.end_time);
        var estimated_price = req.body.estimated_price;
        var category = req.body.category;
        var city = req.body.city;
        var duration = req.body.duration; // duration is in seconds

        const filteredAuctions = [];
        var j = 0;

        allAuctions.forEach(auction => {
            var tempString = auction.start_date;
            var currStartDate = new Date(tempString.toString().substr(0, 10) + ' ' + auction.start_time);
            tempString = auction.end_date;
            var currEndDate = new Date(tempString.toString().substr(0, 10) + ' ' + auction.end_time);
            if (estimated_price - 10000 <= auction.estimated_price && estimated_price + 10000 >= auction.estimated_price && category == auction.category && city == auction.city && !(currStartDate >= endDate || currEndDate <= startDate)) {
                filteredAuctions[j] = { start_time: currStartDate, end_time: currEndDate };
                j++;
            }
        });
        filteredAuctions.sort(comp);

        var temp = startDate;
        temp.setSeconds(temp.getSeconds() + duration);

        if (j == 0 || filteredAuctions[0].start_time >= temp) {
            return startDate;
        }
        else{
            temp = filteredAuctions[j - 1].end_time;
            temp.setSeconds(temp.getSeconds() + duration);
            if (temp <= endDate) {
                return (filteredAuctions[j - 1].end_time);
            }
        }
        var ind = -1;
        var k1 = 0;
        var k2 = 0;
        var interections = j+1;
        while (k1 < j) {
            if (k1 < j - 1) {
                if ((filteredAuctions[k1 + 1].start_time - filteredAuctions[k1].end_time)/1000 >= duration) {
                    return filteredAuctions[k1].end_time;
                }
            }
            k2 = max(k1, k2);
            while (k2 < j) {
                temp = max(filteredAuctions[k1].start_time, startDate);
                temp.setSeconds(temp.getSeconds() + duration);
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
        return max(filteredAuctions[ind].start_time, startDate);
    } catch (err) {
        console.error(`Error inside suggestion function: `, err);
        return res.json({err});
    }
}

module.exports = {
    startTimeSuggestion
}