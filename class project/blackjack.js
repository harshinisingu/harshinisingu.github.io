/* By: Harshini Singu */

var Blackjack = (function () {

	function Card(face, suit) {
		this.face = face;
		this.suit = suit;
	}

	Card.prototype.getValue = function (currentTotal) {
		var value = 0;

		if (this.face == 'A' && currentTotal < 11) {
			value = 11;
		} else if (this.face == 'A') {
			value = 1;
		} else if (this.face == 'J' || this.face == 'Q' || this.face == 'K') {
			value = 10;
		} else {
			value = parseInt(this.face);
		}
		return value;
	}

	Card.prototype.view = function () {
		var htmlEntities = {
			'spades': '&spadesuit;',
			'clubs': '&clubsuit;',
			'hearts': '&heartsuit;',
			'diamonds': '&diamondsuit;',
		}
		return `
			<div class="card ` + this.suit + `">
				<div class="top face">` + this.face + `</div>
				<div class="suit">` + htmlEntities[this.suit] + `</div>
				<div class="bottom face">` + this.face + `</div>
			</div>
		`;
	}

	function Player(element, hand) {
		this.hand = hand;
		this.element = element;
	}

	Player.prototype.hit = function (card) {
		this.hand.push(card);
	}

	Player.prototype.getScore = function () {
		var points = 0;
		for (var i = 0; i < this.hand.length; i++) {
			if (i == 0) points = this.hand[i].getValue(0);
			else points += this.hand[i].getValue(points);
		}
		return points;
	}

	Player.prototype.showHand = function () {
		var hand = "";
		for (var i = 0; i < this.hand.length; i++) {
			hand += this.hand[i].view();
		}
		return hand;
	}

	/*
	Player.prototype.getCurrentValue = function () {
		var currentValue = 0;
		var splitEnable = false;
		currentValue = this.player.hand[0];
		if (this.player.getScore) {
			splitEnable = true;
		} else {
			splitEnable = false;
		}
		return splitEnable;
	}
	*/

	var Deck = new function () {
		this.faces = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
		this.suits = ['hearts', 'spades', 'diamonds', 'clubs'];
		this.deck;

		this.init = function () {
			this.deck = [];
			for (var s = 3; s >= 0; s--) {
				for (var r = 12; r >= 0; r--) {
					this.deck.push(new Card(this.faces[r], this.suits[s]));
				}
			}
		}

		this.shuffle = function () {
			var j, x, i;
			for (i = this.deck.length; i; i--) {
				j = Math.floor(Math.random() * i);
				x = this.deck[i - 1];
				this.deck[i - 1] = this.deck[j];
				this.deck[j] = x;
			}
		}

	}

	var Game = new function () {

		this.dealBtnHandler = function () {
			Game.start();
			this.dealBtn.disabled = true;
			this.hitBtn.disabled = false;
			this.standBtn.disabled = false;
			this.splitBtn.disabled = false;
		}

		this.hitBtnHandler = function () {

			var card = Deck.deck.pop();
			this.player.hit(card);

			document.getElementById(this.player.element).innerHTML += card.view();
			this.playerScore.innerHTML = this.player.getScore();

			if (this.player.getScore() > 21) {
				this.gameEnded('YOU LOST!');
			}
		}

		this.standBtnHandler = function () {
			this.hitBtn.disabled = true;
			this.standBtn.disabled = true;
			this.splitBtn.disabled = true;

			while (true) {
				var card = Deck.deck.pop();

				this.dealer.hit(card);
				document.getElementById(this.dealer.element).innerHTML += card.view();
				this.dealerScore.innerHTML = this.dealer.getScore();

				var playerBlackjack = this.player.getScore() == 21,
					dealerBlackjack = this.dealer.getScore() == 21;

				if (dealerBlackjack && !playerBlackjack) {
					this.gameEnded('YOU LOST!');
					break;
				} else if (dealerBlackjack && playerBlackjack) {
					this.gameEnded('Push (Draw)');
					break;
				} else if (this.dealer.getScore() > 21 && this.player.getScore() <= 21) {
					this.gameEnded('YOU WON!');
					break;
				} else if (this.dealer.getScore() > this.player.getScore() && this.dealer.getScore() <= 21 && this.player.getScore() < 21) {
					this.gameEnded('YOU LOST!');
					break;
				}

			}
		}

		/*
		this.splitBtnHandler = function () {	

				if (getCurrentValue) {
					this.splitBtn.disabled = false;
				} else {
					this.splitBtn.disabled = true;
				}
		}
		*/
		this.splitBtnHandler = function () {
			alert("Full functionality has not yet been established.");
		}

		this.init = function () {
			this.dealerScore = document.getElementById('dealer-score').getElementsByTagName("span")[0];
			this.playerScore = document.getElementById('player-score').getElementsByTagName("span")[0];
			this.dealBtn = document.getElementById('deal');
			this.hitBtn = document.getElementById('hit');
			this.standBtn = document.getElementById('stand');
			this.splitBtn = document.getElementById('split');
			this.dealBtn.addEventListener('click', this.dealBtnHandler.bind(this));
			this.hitBtn.addEventListener('click', this.hitBtnHandler.bind(this));
			this.standBtn.addEventListener('click', this.standBtnHandler.bind(this));
			this.splitBtn.addEventListener('click', this.splitBtnHandler.bind(this));
		}


		this.start = function () {

			Deck.init();
			Deck.shuffle();

			this.dealer = new Player('dealer', [Deck.deck.pop()]);

			this.player = new Player('player', [Deck.deck.pop(), Deck.deck.pop()]);

			document.getElementById(this.dealer.element).innerHTML = this.dealer.showHand();
			document.getElementById(this.player.element).innerHTML = this.player.showHand();

			this.dealerScore.innerHTML = this.dealer.getScore();
			this.playerScore.innerHTML = this.player.getScore();

			this.setMessage("HIT or STAND");
		}

		this.gameEnded = function (string) {
			this.setMessage(string);
			this.dealBtn.disabled = false;
			this.hitBtn.disabled = true;
			this.standBtn.disabled = true;
			this.splitBtn.disabled = true;
		}

		this.setMessage = function (string) {
			document.getElementById('status').innerHTML = string;
		}

	}

	return {
		init: Game.init.bind(Game)
	}

})() 