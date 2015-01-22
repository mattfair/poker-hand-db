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

        this.handRangeStringCompress = function (handRangeString) {

        };
  });
