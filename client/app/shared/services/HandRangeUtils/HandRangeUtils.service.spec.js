'use strict';


chai.should();
var expect = chai.expect;


describe('Service: HandRangeUtils', function () {

    // load the service's module
    beforeEach(module('handDbApp'));

    // instantiate service
    var HandRangeUtils;
    beforeEach(inject(function (_HandRangeUtils_) {
        HandRangeUtils = _HandRangeUtils_;
    }));

    it('should do something', function () {
        expect(!!HandRangeUtils).to.be.true;
    });

    it('should do something', function () {
        expect(!!HandRangeUtils).to.be.true;
    });

    describe('parseHand', function () {
        it('Pocket pair has undefined suitedness', function() {
            var pair = HandRangeUtils.parseHand("AA");
            expect(pair.card1).to.equal("A");
            expect(pair.card2).to.equal("A");
            expect(pair.suitedness).to.equal(undefined);
        });

        it('Suited connector', function() {
            var hand = HandRangeUtils.parseHand("56s");
            expect(hand.card1).to.equal("5");
            expect(hand.card2).to.equal("6");
            expect(hand.suitedness).to.equal("s");
        });
    });


    describe('expandRange', function(){

        it('range between 2-Q is 23456789TJQ', function() {
            var range = HandRangeUtils.expandRange("2","Q");
            expect(range).to.equal("23456789TJQ");
        });

        it('range between Q-2 is 23456789TJQ, order does not matter', function() {
            var range = HandRangeUtils.expandRange("Q","2");
            expect(range).to.equal("23456789TJQ");
        });

        it('range between 7-7 is 7', function() {
            var range = HandRangeUtils.expandRange("7","7");
            expect(range).to.equal("7");
        });
    });



    describe('handRangeStringExpand', function () {
        it('hand range with the first hand the same expands horizontally', function() {
            expect(HandRangeUtils.handRangeStringExpand("AKs-A2s")).to.equal("AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s");
        });

        it('hand range with the second hand the same expands vertically', function(){
            expect(HandRangeUtils.handRangeStringExpand("A2s-32s")).to.equal("A2s,K2s,Q2s,J2s,T2s,92s,82s,72s,62s,52s,42s,32s");
        });

        it('hand range with single cards in a comma separated list should just join together', function(){
            expect(HandRangeUtils.handRangeStringExpand("A2s-32s,AKs")).to.equal("AKs,A2s,K2s,Q2s,J2s,T2s,92s,82s,72s,62s,52s,42s,32s");
        });
    });

    describe('handRangeToString', function(){
        it('converting a hashmap to a comma delimited string', function(){
            var handRangeArray =  {'22':false,'33':false,'44':false,'55':false,'66':false,'77':true,'88':true,'99':true,'TT':true,'JJ':true,'QQ':true,'KK':true,'AA':true,'32s':false,'32o':false,'42s':false,'42o':false,'52s':false,'52o':false,'62s':false,'62o':false,'72s':false,'72o':false,'82s':false,'82o':false,'92s':false,'92o':false,'T2s':false,'T2o':false,'J2s':false,'J2o':false,'Q2s':false,'Q2o':false,'K2s':false,'K2o':false,'A2s':false,'A2o':false,'43s':false,'43o':false,'53s':false,'53o':false,'63s':false,'63o':false,'73s':false,'73o':false,'83s':false,'83o':false,'93s':false,'93o':false,'T3s':false,'T3o':false,'J3s':false,'J3o':false,'Q3s':false,'Q3o':false,'K3s':false,'K3o':false,'A3s':true,'A3o':false,'54s':false,'54o':false,'64s':false,'64o':false,'74s':false,'74o':false,'84s':false,'84o':false,'94s':false,'94o':false,'T4s':false,'T4o':false,'J4s':false,'J4o':false,'Q4s':false,'Q4o':false,'K4s':false,'K4o':false,'A4s':true,'A4o':false,'65s':false,'65o':false,'75s':false,'75o':false,'85s':false,'85o':false,'95s':false,'95o':false,'T5s':false,'T5o':false,'J5s':false,'J5o':false,'Q5s':false,'Q5o':false,'K5s':false,'K5o':false,'A5s':true,'A5o':false,'76s':false,'76o':false,'86s':false,'86o':false,'96s':false,'96o':false,'T6s':false,'T6o':false,'J6s':false,'J6o':false,'Q6s':false,'Q6o':false,'K6s':false,'K6o':false,'A6s':true,'A6o':false,'87s':false,'87o':false,'97s':false,'97o':false,'T7s':false,'T7o':false,'J7s':false,'J7o':false,'Q7s':false,'Q7o':false,'K7s':false,'K7o':false,'A7s':false,'A7o':false,'98s':false,'98o':false,'T8s':false,'T8o':false,'J8s':false,'J8o':false,'Q8s':false,'Q8o':false,'K8s':false,'K8o':false,'A8s':false,'A8o':false,'T9s':false,'T9o':false,'J9s':false,'J9o':false,'Q9s':false,'Q9o':false,'K9s':false,'K9o':false,'A9s':false,'A9o':false,'JTs':false,'JTo':false,'QTs':false,'QTo':false,'KTs':false,'KTo':false,'ATs':true,'ATo':false,'QJs':false,'QJo':false,'KJs':false,'KJo':false,'AJs':true,'AJo':true,'KQs':true,'KQo':true,'AQs':true,'AQo':true,'AKs':true,'AKo':true};
            var handRangeStr = HandRangeUtils.handRangeToString(handRangeArray);
            expect(handRangeStr).to.contain("77");
            expect(handRangeStr).to.contain("88");
            expect(handRangeStr).to.contain("99");
            expect(handRangeStr).to.contain("TT");
            expect(handRangeStr).to.contain("JJ");
            expect(handRangeStr).to.contain("QQ");
            expect(handRangeStr).to.contain("KK");
            expect(handRangeStr).to.contain("AA");
            expect(handRangeStr).to.contain("A3s");
            expect(handRangeStr).to.contain("A4s");
            expect(handRangeStr).to.contain("A5s");
            expect(handRangeStr).to.contain("A6s");
            expect(handRangeStr).to.contain("ATs");
            expect(handRangeStr).to.contain("AJs");
            expect(handRangeStr).to.contain("AJo");
            expect(handRangeStr).to.contain("KQs");
            expect(handRangeStr).to.contain("KQo");
            expect(handRangeStr).to.contain("AQs");
            expect(handRangeStr).to.contain("AQo");
            expect(handRangeStr).to.contain("AKs");
            expect(handRangeStr).to.contain("AKo");
        });
    });
});
