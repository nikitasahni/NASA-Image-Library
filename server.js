// JavaScript File

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/bear');

var Bear = require('./bear');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

var port = process.env.PORT || 8080;


//Router stuff
var router = express.Router();

router.use(function(req, res, next) {
    console.log('Something is happening.');
    next(); 
});

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.route('/bears')

    .post(function(req, res) {
        
        var bear = new Bear();      // create a new instance of the Bear model
        bear.name = req.body.name;  // set the bears name (comes from the request)
    
        bear.save(function(err) {
            if (err) {
                res.send(err);
            }
            res.json({ message: 'Bear created!' });
        });
    })

    .get(function(req, res) {
        
        Bear.find(function(err, bears) {
            if (err) {
                res.send(err);
            }

            res.json(bears);
        });
    });
    
router.route('/bears/:bear_id')

    // get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
    .get(function(req, res) {
        Bear.findById(req.params.bear_id, function(err, bear) {
            if (err) {
                res.send(err);
            }
            res.json(bear);
        });
    })
    
    .put(function(req, res) {

        // use our bear model to find the bear we want
        Bear.findById(req.params.bear_id, function(err, bear) {

            if (err) {
                res.send(err);
            }

            bear.name = req.body.name;  // update the bears info

            // save the bear
            bear.save(function(err) {
                if (err) {
                    res.send(err);
                }

                res.json({ message: 'Bear updated!' });
            });

        });
    })
    
    .delete(function(req, res) {
        Bear.remove({
            _id: req.params.bear_id
        }, function(err, bear) {
            if (err) {
                res.send(err);
            }

            res.json({ message: 'Successfully deleted' });
        });
    });

app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port);