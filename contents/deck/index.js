var deck = {

    cards: [],

    initCards: function() {
        deck.cards = [];
    },

    addCard: function(card, cardEditionObj) {
        var card_edition_and_id = 
            {
                "card_obj": card,
                "card_edition": cardEditionObj,
                "mult_id": cardEditionObj.multiverse_id
            }
        deck.cards.push(card_edition_and_id);
        console.log("Card Added.  deck.cards: ",deck.cards);
    },

    removeCard: function(card) {
        var len = deck.cards.length;
        for(var i = 0; i < len; i++) {
            if(deck.cards[i].mult_id == card.mult_id) {
                deck.cards.splice(i, 1);
                break;
            }
        }
        // re-display the cards
        deck.viewDeck();
    },

    resetDeck: function(event) {
        if(deck.cards != []) {
            if(confirm("Reset Deck?")) {
                deck.cards = [];
                deck.viewDeck();
            }
        }
    },

    sortByRarity: function() {
        deck.cards = _.sortBy(deck.cards, 
            function(card) {
                var rarity = card.card_edition.rarity;
                var sortRarity = 0;
                if(rarity == "mythic") {
                    sortRarity = 1;
                } else if(rarity == "rare") {
                    sortRarity = 2;
                } else if(rarity == "uncommon") {
                    sortRarity = 3;
                } else if(rarity == "common") {
                    sortRarity = 4;
                }
                return sortRarity;
            }
        );
        deck.viewDeck();
    },

    viewDeck: function () {
        $.get("/mtgdeckbuilder/deck/view.jade", function(template) {
            var html = jade.render(template, {
                data: deck.cards
            })
            $("#list").html(html)
        })
    },

    getRandom: function() {
        $.ajax({
            url: "https://api.mtgdb.info/cards/random",
            success: function(data) {
                console.log("Data:", data);
                if(data) {
                    $.get("/mtgdeckbuilder/deck/view.jade", function(template) {
                        var html = jade.render(template, {
                            data: data
                        })
                        $("#list").html(html)
                    })
                }
            }
        });
    },

    postTest: function(event) {
        //console.log("Event: ", event);
        event.preventDefault();
        $.ajax({
            type: "POST",
            url: "/mtgdeckbuilder/storage/test.json.data",
            data: {test:"testData"},
            dataType: "json",
            success: function(data) {
                console.log("Post data: ", data);
                if(data) {
                    $.get("/mtgdeckbuilder/deck/list.jade", function(template) {
                        var html = jade.render(template, {
                            data: data
                        })
                        $("#list").html(html)
                    })
                }
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            alert(textStatus);
        });
    },

    load: function() {
        $.get("/mtgdeckbuilder/deck/ui.jade", function(template) {
            var html = jade.render(template);
            $("#searchdiv").html(html);
        })
        
        // list all cards
        deck.viewDeck();
        console.log("Load Deck. deck.cards: ",deck.cards);
    }
}
