'use strict';

angular.module('handDbApp')
  .service('HandRangeUtils', function () {
        this.handRangeStringToMap = function (handRangeString) {
            var cards = '23456789TJQKA';

            var hands = {};

            //add pairs
            for (var i = 0; i < cards.length; i++) {
                hands[cards[i] + cards[i]] = false;
            }

            //suited and unsuited cards
            for (var i = 0; i < cards.length; i++) {
                for (var j = i + 1; j < cards.length; j++) {
                    hands[cards[j] + cards[i] + 's'] = false;
                    hands[cards[j] + cards[i] + 'o'] = false;
                }
            }

            if (handRangeString.length > 0) {
                var myHands = this.handRangeStringExpand(handRangeString).split(",");

                for (var i = 0; i < myHands.length; i++) {
                    hands[myHands[i]] = true;
                }
            }

            return hands;
        };

        this.handRangeStringExpand = function (handRangeString) {
            var hands = handRangeString.split(",");
            var myExpandedRange = [];
            for (var handIndex = 0; handIndex < hands.length; handIndex++) {
                var hand = hands[handIndex];
                var courseHandParsing = /([AKQJT98765432][AKQJT98765432][so]|[AKQJT98765432]{2})-([AKQJT98765432][AKQJT98765432][so]|[AKQJT98765432]{2})|([AKQJT98765432][AKQJT98765432][so]|[AKQJT98765432]{2})|([AKQJT98765432](x|d|s|h|c)[AKQJT98765432](x|d|s|h|c))/g;
                var match = courseHandParsing.exec(hand);

                if (match[1] != undefined && match[2] != undefined) {
                    var hand1 = match[1];
                    var hand2 = match[2];
                    var parsedHand1 = this.parseHand(hand1);
                    var parsedHand2 = this.parseHand(hand2);

                    //pairs diaganal range
                    if (parsedHand1.card1 == parsedHand1.card2) {
                        var expandedHandRange = this.expandRange(parsedHand1.card1, parsedHand2.card1);
                        for (var i = 0; i < expandedHandRange.length; i++) {
                            var card = expandedHandRange[i];
                            myExpandedRange.push(card + card);
                        }
                    }

                    //vertical range
                    else if (parsedHand1.card1 == parsedHand2.card1) {
                        var expandedHandRange = this.expandRange(parsedHand1.card2, parsedHand2.card2);
                        for (var i = 0; i < expandedHandRange.length; i++) {
                            var card = expandedHandRange[i];
                            myExpandedRange.push(parsedHand1.card1 + card + parsedHand2.suitedness);
                        }
                    }

                    //horizontal range
                    else {
                        var expandedHandRange = this.expandRange(parsedHand1.card1, parsedHand2.card1);
                        for (var i = 0; i < expandedHandRange.length; i++) {
                            var card = expandedHandRange[i];
                            myExpandedRange.push(card + parsedHand1.card2 + parsedHand2.suitedness);
                        }
                    }
                } else {
                    if (match[3] != undefined) {
                        var parsedHand = this.parseHand(match[3]);
                        if (parsedHand.card1 == parsedHand.card2 || parsedHand.suitedness != undefined) {
                            myExpandedRange.push(match[3]);
                        } else {
                            myExpandedRange.push(parsedHand.card1 + parsedHand.card2 + "s");
                            myExpandedRange.push(parsedHand.card1 + parsedHand.card2 + "o");
                        }
                    } else if (match[4] != undefined) {
                        var parsedHand = this.parseHand(match[3]);
                        if (parsedHand.suitedness != undefined) {
                            myExpandedRange.push(match[3]);
                        } else {
                            //for the pocket pairs
                            myExpandedRange.push(parsedHand.card1 + parsedHand.card2 + "s");
                        }
                    }
                }
            }

            myExpandedRange.reverse();
            return myExpandedRange.toString();
        };

        this.parseHand = function (hand) {
            var regex = /([AKQJT98765432])([AKQJT98765432])([so])|([AKQJT98765432]\4)|([AKQJT98765432])(x|d|s|c|h)([AKQJT98765432])(x|d|s|c|h)|([AKQJT98765432])([AKQJT98765432])/;
            var match = regex.exec(hand);

            var handCard1, handCard1Suite, handCard2, handCard2Suite, handSuitedness;

            //Basic hand definition (AKs, JTo, etc)
            if (match[1] != undefined && match[2] != undefined) {
                handCard1 = match[1];
                handCard2 = match[2];
                handSuitedness = match[3];
            }
            //Pocket pairs
            else if (match[4] != undefined) {
                handCard1 = match[4];
                handCard2 = match[4];
                handSuitedness = undefined;
            } else if (match[5] != undefined) {
                handCard1 = match[5];
                handCard1Suite = match[6];
                handCard2 = match[7];
                handCard2Suite = match[8];

                if (handCard1Suite != "x" && handCard2Suite != "x") {
                    handSuitedness = handCard1Suite == handCard2Suite ? "s" : "o";
                }
            } else {
                //without suitedness, assuming it represents both (i.e. AK = AKs, AKo)
                handCard1 = match[8];
                handCard2 = match[9];
                handSuitedness = undefined;
            }

            return {
                card1: handCard1,
                card2: handCard2,
                suitedness: handSuitedness
            }
        };

        /**
         * Returns a substring of 23456789TJQKA with all the cards between two cards including the two cards.
         * For example 88-33 would be 3,4,5,6,7,8 and would return a string 345678.
         * @param card1 character (23456789TJQKA)
         * @param card2 character (23456789TJQKA)
         * @returns {string} a substring of 23456789TJQKA
         */
        this.expandRange = function (card1, card2) {
            var cards = "23456789TJQKA";

            var index1 = cards.indexOf(card1);
            var index2 = cards.indexOf(card2);

            var start = Math.min(index1, index2);
            var end = Math.max(index1, index2);
            var length = end - start + 1;

            return cards.substr(start, length);
        };

        this.handRangeToString = function (handMap) {
            var handStr = "";
            var myHandsArray = [];
            for(var hand in handMap){
                if(handMap[hand]){
                    myHandsArray.push(hand);
                }
            }
            console.log(myHandsArray);
            myHandsArray.reverse();
            console.log(myHandsArray);
            return myHandsArray.join(",");
        };

        /**
         * If a comes before b, then negative
         * If a is equal to b, then 0
         * If a comes after b, then positive
         * @param a card value of AKQJT98765432
         * @param b card value of AKQJT98765432
         */
        this.sortPokerCards = function(a,b){
            var cardOrder = "AKQJT98765432";
            var aIndex = cardOrder.indexOf(a);
            var bIndex = cardOrder.indexOf(b);
            return aIndex - bIndex;
        }

        /**
         * Returns an array of single card streaks in a string of cards
         * @param cards
         */
        this.getSingleCardStreaks = function(cardsUnsorted){
            var streaks = [];
            var currentStreak = []
            var other = [];


            var sortedCards = cardsUnsorted.sort(this.sortPokerCards);
            var cards = sortedCards.join('');

            for(var i=0; i<cards.length; i++){
                for(var j=1; j<cards.length; j++){
                    if(i < j) {
                        var distance = this.sortPokerCards(cards[i], cards[j]);
                        if(distance == -1){
                            var isPartOfCurrentStreak = false;

                            //check to see if anything in the current streak is 1 away
                            for(var k = 0; k<currentStreak.length; k++){
                                if(Math.abs(this.sortPokerCards(currentStreak[k], cards[i])) == 1 || Math.abs(this.sortPokerCards(currentStreak[k], cards[j]))==1){
                                    isPartOfCurrentStreak=true;
                                    break;
                                }
                            }

                            //start new streak and store the old one
                            if(isPartOfCurrentStreak == false && currentStreak.length > 0){
                                streaks.push(currentStreak);
                                currentStreak = [];
                            }

                            if(window._.contains(currentStreak,cards[i]) == false){
                                currentStreak.push(cards[i]);
                            }
                            currentStreak.push(cards[j]);
                            break;
                        }
                    }
                }
            }

            //push on the current streak
            if(currentStreak.length > 0){
                streaks.push(currentStreak);
            }

            return {streaks: streaks, other:other};
        }

        /**
         * Add to hand range
         * @param streaks compresses streaks
         * @param handRange range to add compresses streaks streaks to
         * @param type [0 for pocket pair, 1 for vertical, 2 for horizontal]
         * @returns {*}
         */
        this.addToHandRange = function(streaks, handRange, type){
            for(var cardAndSuit in streaks){
                var card = cardAndSuit[0];
                if(streaks[cardAndSuit].length >= 1) {
                    var vals = this.getSingleCardStreaks(streaks[cardAndSuit]);
                    var strk = vals.streaks;

                    for(var sIndex=0; sIndex<strk.length; sIndex++){
                        if(strk[sIndex].length > 1) {

                            var start = strk[sIndex][0];
                            var end =  window._.last(strk[sIndex]);

                            if(type == 0){
                                var hand1 = start + start;
                                var hand2 = end + end;
                                var range = hand1+"-"+hand2;
                                handRange.push(range);
                            } else if(type == 1){

                                var isBigger = this.sortPokerCards(start,card) > 0;

                                var suit = cardAndSuit[1];
                                var hand1 = (isBigger? card + start : start + card)+suit;
                                var hand2 = (isBigger? card + end : end + card)+suit;

                                var range = hand1+"-"+hand2;
                                handRange.push(range);
                            } else {
                                var isBigger = this.sortPokerCards(end,card) > 0;

                                var suit = cardAndSuit[1];
                                var hand1 = (isBigger? card + start : start + card)+suit;
                                var hand2 = (isBigger? card + end : end + card)+suit;

                                var range = hand1+"-"+hand2;
                                handRange.push(range);

                            }
                        }
                    }

                    for(var i=0; i<vals.other.length; i++){
                        var card2 = vals.other[i];
                        var isBigger = this.sortPokerCards(card2[0], card) > 0;
                        var suit = cardAndSuit[1];
                        var hand = (isBigger ? card + card2 : card2 + card) + suit;
                        handRange.push(hand)
                    }
                }
            }

            return handRange;
        }

        this.handRangeStringCompress = function (handRangeString) {

            //"AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s")).to.equal("AKs-A2s");

            var verticalStreaks = {};
            var horizontalStreaks = {};
            var pairStreaks = [];

            var cards="AKQJT98765432";

            //suited
            for(var i=0; i<cards.length;  i++){
                verticalStreaks[cards[i]+"s"] = new Array();
                horizontalStreaks[cards[i]+"s"] = new Array();
            };
            //un-suited
            for(var i=0; i<cards.length;  i++){
                verticalStreaks[cards[i]+"o"] = new Array();
                horizontalStreaks[cards[i]+"o"] = new Array();
            };

            var handArray = handRangeString.split(",");


            //veretical/horizontql
            for(var i = 0; i < handArray.length; i++){
                var parsedHand = this.parseHand(handArray[i]);
                if(parsedHand.card1 != parsedHand.card2) {
                    verticalStreaks[parsedHand.card1+parsedHand.suitedness].push(parsedHand.card2);
                    horizontalStreaks[parsedHand.card2+parsedHand.suitedness].push(parsedHand.card1);
                }
            }

            //pairs
            for(var i = 0; i < handArray.length; i++){
                var parsedHand = this.parseHand(handArray[i]);
                if(parsedHand.card1 == parsedHand.card2) {
                    pairStreaks.push(parsedHand.card1);
                }
            }

            //detect streaks
            var handRange = [];
            var vals = this.getSingleCardStreaks(pairStreaks);
            var strk = vals.streaks;
            for(var i=0; i<strk.length; i++){
                var start = strk[i][0];
                var end = window._.last(strk[i]);
                var range = start+start+"-"+end+end;
                handRange.push(range);
            }

            handRange = this.addToHandRange(verticalStreaks, handRange, 1);
            handRange = this.addToHandRange(horizontalStreaks, handRange, 2);

            //add any stand-alone cards that aren't part of any ranges
            var handRangeStr = handRange.join(",");
            for(var i = 0; i < handArray.length; i++) {
                var hand = handArray[i];
                if(this.isInRange(handRangeStr, hand) == false){
                    handRange.push(hand);
                }
            }

            //update hand range str
            handRangeStr = handRange.join(",");

            return handRangeStr;

        };

        /**
         * Determine if a card is within a hand range
         * @param handRange
         * @param card
         */
        this.isInRange = function(handRange, card){
            var isRange = handRange.indexOf('-') != -1;
            if(isRange) {
                var cards = this.handRangeStringExpand(handRange).split(',');
                for (var i = 0; i < cards.length; i++) {
                    if (cards[i] == card) {
                        return true;
                    }
                }
            }
            return false;
        }
  });
