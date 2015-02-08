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

    describe('parseHand', function () {
        it('Empty with empty cards and undefined suitedness', function(){
            var pair = HandRangeUtils.parseHand("");
            expect(pair.card1).to.equal("");
            expect(pair.card2).to.equal("");
            expect(pair.suitedness).to.equal(undefined);
        });

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
        it('handle empty', function() {
            expect(HandRangeUtils.handRangeStringExpand("")).to.equal("");
        });

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

    describe('handRangeStringCompress', function () {
        it('Horizontal compression', function() {
            expect(HandRangeUtils.handRangeStringCompress("AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s")).to.equal("AKs-A2s");
        });

        it('Vertical compression', function(){
            expect(HandRangeUtils.handRangeStringCompress("A2s,K2s,Q2s,J2s,T2s,92s,82s,72s,62s,52s,42s,32s")).to.equal("A2s-32s");
        });

        it(('Pocket pair compression'), function() {
            expect(HandRangeUtils.handRangeStringCompress("AA,QQ,KK,JJ,TT")).to.equal("AA-TT");
            expect(HandRangeUtils.handRangeStringCompress("55,44,33")).to.equal("55-33");
            expect(HandRangeUtils.handRangeStringCompress("AA,QQ,KK,JJ,TT,55,44,33")).to.equal("AA-TT,55-33");
        });

        it('mixture of various patterns compression', function(){
            expect(HandRangeUtils.handRangeStringCompress("AKs,A2s,K2s,Q2s,J2s,T2s,92s,82s,72s,62s,52s,42s,32s")).to.equal("A2s-32s,AKs");
            expect(HandRangeUtils.handRangeStringCompress("AKs,A2s,K2s,Q2s,J2s,T2s,92s,82s,72s,62s,52s,42s,32s,AA,QQ,KK,JJ,TT,55,44,33")).to.equal("AA-TT,55-33,A2s-32s,AKs");
        });

        it('Making sure suited and unsuited do not mix', function(){
            expect(HandRangeUtils.handRangeStringCompress("Q4s,J4o,T4s")).to.equal("Q4s,J4o,T4s");
            expect(HandRangeUtils.handRangeStringCompress("Q5o,J5s,T5o")).to.equal("Q5o,J5s,T5o");
            expect(HandRangeUtils.handRangeStringCompress("Q9o,Q8s,Q7o")).to.equal("Q9o,Q8s,Q7o");
        });

        it('Resolve vertical and horizontal streak overlapping', function(){
            expect(HandRangeUtils.handRangeStringCompress('AKo,AKs,AQo,AQs,KQo,KQs,AJo,AJs,KJo,KJs,QJo,QJs,ATo,ATs,KTo,KTs,QTo,QTs,JTo,JTs,AA,KK,QQ,JJ,TT')).to.equal("AA-TT,AKo-ATo,KQo-KTo,QJo-QTo,AKs-ATs,KQs-KTs,QJs-QTs,JTo,JTs");
        })

    });

    describe('sortPokerCards', function(){
        it('determine which cards come before the other', function() {
            expect(HandRangeUtils.sortPokerCards('A','K')).to.below(0);
            expect(HandRangeUtils.sortPokerCards('T','9')).to.below(0);
            expect(HandRangeUtils.sortPokerCards('9','T')).to.above(0);
            expect(HandRangeUtils.sortPokerCards('T','T')).to.equal(0);
        });
    });

    describe('getSingleCardStreaks', function() {
        it('get single card streaks', function() {
           var result = HandRangeUtils.getSingleCardStreaks(['K','Q','J','9','7','6','5','3']);
           expect(result.streaks[0]).to.eql(["K","Q","J"]);
           expect(result.streaks[1]).to.eql(["7","6","5"]);
        });
    });

    describe('isInRange', function() {
        it('cards that are inside a range of hands', function(){
            expect(HandRangeUtils.isInRange('AKs-AJs','AQs')).to.be.true;
            expect(HandRangeUtils.isInRange('AKo-AJo','AQo')).to.be.true;
            expect(HandRangeUtils.isInRange('J5s-75s','95s')).to.be.true;
            expect(HandRangeUtils.isInRange('J5o-75o','95o')).to.be.true;
            expect(HandRangeUtils.isInRange('AJs-ATs,J5o-75o','95o')).to.be.true;
        });

        it('cards that are outside a range of hands', function(){
            expect(HandRangeUtils.isInRange('AKs-AJs','A5s')).to.be.false;
            expect(HandRangeUtils.isInRange('AKs-AJs','A5o')).to.be.false;
            expect(HandRangeUtils.isInRange('AKo-AJo','A7o')).to.be.false;
            expect(HandRangeUtils.isInRange('J5s-75s','KQs')).to.be.false;
            expect(HandRangeUtils.isInRange('J5o-75o','KQo')).to.be.false;
            expect(HandRangeUtils.isInRange('AJs-ATs,J5o-75o','K8s')).to.be.false;
        });
    });

    describe('findCompliment', function() {
       it('Find only what is need to add without any additional overlap', function(){
          expect(HandRangeUtils.findCompliment('AKo-ATo,KQo-KTo,QJo-QTo', 'ATo-JTo')).to.equal('JTo');
       });
    });

   describe('numHandCombos', function() {
     it('Counts the number of hand combinations in a hand range', function(){
       expect(HandRangeUtils.numHandCombos('AA')).to.equal(6);
       expect(HandRangeUtils.numHandCombos('AKs')).to.equal(4);
       expect(HandRangeUtils.numHandCombos('AKo')).to.equal(12);
       expect(HandRangeUtils.numHandCombos('AKs,AKo')).to.equal(16);
       expect(HandRangeUtils.numHandCombos('KK,AKs')).to.equal(10);
       expect(HandRangeUtils.numHandCombos('KK,AKs,AQo')).to.equal(22);
       expect(HandRangeUtils.numHandCombos('QQ-33,AKo-AQo,AQs-ATs,KQs-KTs,QJs-QTs,JTs-J9s,T9s,98s,87s,76s,65s,54s')).to.equal(148);
       expect(HandRangeUtils.numHandCombos('AA-22,AKo-A7o,KQo-K9o,QJo-Q9o,JTo-J9o,T9o,98o,AKs-A2s,KQs-K2s,QJs-Q4s,JTs-J7s,T9s-T7s,98s-97s,87s-86s,76s-75s,65s-64s,54s')).to.equal(482);
     });

     it('Counts the number of hand combinations in a hand range with dead cards', function(){
       expect(HandRangeUtils.numHandCombos('AA', 'Ah')).to.equal(3);
       expect(HandRangeUtils.numHandCombos('AA', 'ah')).to.equal(3);
       expect(HandRangeUtils.numHandCombos('AKs', 'Ah')).to.equal(3);
       expect(HandRangeUtils.numHandCombos('AKs', 'Ah,Ac')).to.equal(2);
       expect(HandRangeUtils.numHandCombos('AKs', 'Ah,Ac,As')).to.equal(1);
       expect(HandRangeUtils.numHandCombos('AKs', 'Ah,Ac,As,Ad')).to.equal(0);
       expect(HandRangeUtils.numHandCombos('AKo', 'Ah,Ac')).to.equal(6);
       expect(HandRangeUtils.numHandCombos('AQs', 'Ah,Qh')).to.equal(3);
       expect(HandRangeUtils.numHandCombos('AQs', 'Ah,Qc')).to.equal(2);
       expect(HandRangeUtils.numHandCombos('AA,AKo,AKs-AQs', 'Ah,Ac')).to.equal(11);
       expect(HandRangeUtils.numHandCombos('AA,AKo,AKs-AQs', 'Ah,Ac,Qc')).to.equal(11);
       expect(HandRangeUtils.numHandCombos('AA,AKo,AKs-AQs', 'Ah,Ac,Qd')).to.equal(10);
       expect(HandRangeUtils.numHandCombos('AA,AKo,AKs-AQs', 'Ah,Ac,Qc,Qd')).to.equal(10);
       expect(HandRangeUtils.numHandCombos('QQ-33,AKo-AQo,AQs-ATs,KQs-KTs,QJs-QTs,JTs-J9s,T9s,98s,87s,76s,65s,54s','Ah,Ac')).to.equal(130);
       expect(HandRangeUtils.numHandCombos('AA-22,AKo-A7o,KQo-K9o,QJo-Q9o,JTo-J9o,T9o,98o,AKs-A2s,KQs-K2s,QJs-Q4s,JTs-J7s,T9s-T7s,98s-97s,87s-86s,76s-75s,65s-64s,54s','Ah,Ac')).to.equal(411);
       expect(HandRangeUtils.numHandCombos('AA-22,AKo-A7o,KQo-K9o,QJo-Q9o,JTo-J9o,T9o,98o,AKs-A2s,KQs-K2s,QJs-Q4s,JTs-J7s,T9s-T7s,98s-97s,87s-86s,76s-75s,65s-64s,54s','Ad,Kh,6c,Js,Td')).to.equal(362);
       expect(HandRangeUtils.numHandCombos('AA-88,AKo-AQo,KQo,AKs-A9s,A5s-A3s,KQs-KTs,QJs-QTs,JTs,87s,76s', 'Ah,Ac')).to.equal(109);
       expect(HandRangeUtils.numHandCombos('AA-88,AKo-AQo,KQo,AKs-A9s,A5s-A3s,KQs-KTs,QJs-QTs,JTs,87s,76s', 'Ah,Ac,Jc')).to.equal(103);
       expect(HandRangeUtils.numHandCombos('AA-88,AKo-AQo,KQo,AKs-A9s,A5s-A3s,KQs-KTs,QJs-QTs,JTs,87s,76s', 'Ah,Ac,Jc,Td,Qs')).to.equal(85);
       expect(HandRangeUtils.numHandCombos('AA-88,AKo-AQo,KQo,AKs-A9s,A5s-A3s,KQs-KTs,QJs-QTs,JTs,87s,76s', '8h,Jc,8d')).to.equal(128);
       expect(HandRangeUtils.numHandCombos('AA-QQ,33-22,AKo-AQo,AKs-AQs,43s-42s,KQo,KQs,52s,32s', 'ah,qh,2d')).to.equal(67);
     });
   });

  describe('createPairs', function() {
    it('create hand combinations from a list of cards', function(){
      expect(HandRangeUtils.createPairs('Ah,Qh')).to.equal("AhQh");
      expect(HandRangeUtils.createPairs('Ah,Qh,Ad')).to.equal("AhQh,AdAh,AdQh")
    });
  });



});
