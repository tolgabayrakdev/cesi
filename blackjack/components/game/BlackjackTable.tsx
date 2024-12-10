"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, Player, GameState } from "@/types";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

export default function BlackjackTable() {
  const [deck, setDeck] = useState<Card[]>([]);
  const [dealer, setDealer] = useState<Card[]>([]);
  const [player, setPlayer] = useState<Player>({
    id: "1",
    name: "Player",
    hand: [],
    bet: 0,
    balance: 1000,
    score: 0,
    isPlaying: false
  });
  const [gameState, setGameState] = useState<GameState>("betting");
  const [currentBet, setCurrentBet] = useState(0);
  const [gameResult, setGameResult] = useState<string>("");
  const [showResult, setShowResult] = useState(false);

  // Split için yeni state'ler
  const [splitHand, setSplitHand] = useState<Card[]>([]);
  const [splitScore, setSplitScore] = useState(0);
  const [activeSplitHand, setActiveSplitHand] = useState(false);

  const [showAgeConfirmation, setShowAgeConfirmation] = useState(false);
  const [pendingBet, setPendingBet] = useState(0);

  // Kart animasyonu için yardımcı fonksiyon
  const dealCardWithAnimation = async (isDealer: boolean, hidden: boolean = false) => {
    const card = drawCard(hidden);
    
    if (isDealer) {
      setDealer(prev => [...prev, { ...card, dealing: true }]);
    } else {
      setPlayer(prev => ({
        ...prev,
        hand: [...prev.hand, { ...card, dealing: true }]
      }));
    }

    // Animasyon için bekle
    await new Promise(resolve => setTimeout(resolve, 300));
    return card;
  };

  // Deste oluşturma fonksiyonu
  const createDeck = () => {
    const suits = ["hearts", "diamonds", "clubs", "spades"];
    const values = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];
    const newDeck: Card[] = [];

    suits.forEach((suit) => {
      values.forEach((value) => {
        newDeck.push({ suit: suit as Card["suit"], value , hidden: false});
      });
    });

    // Desteyi karıştır
    return shuffleDeck(newDeck);
  };

  // Desteyi karıştırma fonksiyonu
  const shuffleDeck = (deck: Card[]) => {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Kart çekme fonksiyonu
  const drawCard = (hidden: boolean = false): Card => {
    const card = deck[0];
    setDeck(deck.slice(1));
    return { ...card, hidden };
  };

  // Blackjack kontrolü
  const isBlackjack = (hand: Card[]) => {
    return hand.length === 2 && calculateScore(hand) === 21;
  };

  // Oyunu başlatma
  const startGame = async () => {
    if (currentBet <= 0 || currentBet > player.balance) return;

    setGameResult("");
    setShowResult(false);
    
    setPlayer(prev => ({
      ...prev,
      bet: currentBet,
      balance: prev.balance - currentBet,
      isPlaying: true
    }));

    // Kartları sırayla dağıt
    const playerCard1 = await dealCardWithAnimation(false);
    const dealerCard1 = await dealCardWithAnimation(true);
    const playerCard2 = await dealCardWithAnimation(false);
    const dealerCard2 = await dealCardWithAnimation(true, true);

    setPlayer(prev => ({
      ...prev,
      score: calculateScore([playerCard1, playerCard2])
    }));

    // Blackjack kontrolü
    if (isBlackjack([playerCard1, playerCard2])) {
      setGameResult("BLACKJACK! 🎉");
      setShowResult(true);
      endGame(true);
    } else {
      setGameState("playerTurn");
    }
  };

  // Skor hesaplama
  const calculateScore = (hand: Card[]) => {
    let score = 0;
    let aces = 0;

    hand.forEach(card => {
      if (card.hidden) return;
      
      if (typeof card.value === "string") {
        if (card.value === "A") {
          aces += 1;
        } else {
          score += 10;
        }
      } else {
        score += card.value;
      }
    });

    // As değerlerini hesapla
    for (let i = 0; i < aces; i++) {
      if (score + 11 <= 21) {
        score += 11;
      } else {
        score += 1;
      }
    }

    return score;
  };

  // Kart çekme (Hit)
  const hit = async () => {
    if (gameState !== "playerTurn") return;

    const newCard = await dealCardWithAnimation(false);
    const newHand = [...player.hand, newCard];
    const newScore = calculateScore(newHand);

    setPlayer(prev => ({
      ...prev,
      score: newScore
    }));

    // 21 kontrolü ekle
    if (newScore === 21) {
      setGameResult("21! Kazandınız! 🎉");
      setShowResult(true);
      endGame(true);
    } else if (newScore > 21) {
      setGameResult("Battınız! Kaybettiniz 💥");
      setShowResult(true);
      endGame();
    }
  };

  // Durma (Stand)
  const stand = () => {
    if (gameState !== "playerTurn") return;
    setGameState("dealerTurn");
    dealerPlay();
  };

  // Dealer'ın oynaması
  const dealerPlay = () => {
    let currentDealerHand = dealer.map(card => ({ ...card, hidden: false }));
    let dealerScore = calculateScore(currentDealerHand);

    while (dealerScore < 17) {
      const newCard = drawCard();
      currentDealerHand = [...currentDealerHand, newCard];
      dealerScore = calculateScore(currentDealerHand);
    }

    setDealer(currentDealerHand);
    endGame();
  };

  // Oyunu bitirme
  const endGame = (isBlackjack = false) => {
    setGameState("gameOver");
    const playerScore = calculateScore(player.hand);
    const dealerScore = calculateScore(dealer.map(card => ({ ...card, hidden: false })));

    let winnings = 0;
    let resultMessage = "";
    let isWin = false;

    // Önce Blackjack kontrolü
    if (isBlackjack) {
      winnings = player.bet * 2.5;
      resultMessage = "BLACKJACK! Tebrikler! 🎉";
      isWin = true;
    }
    // Sonra bust (21'i geçme) kontrolü
    else if (playerScore > 21) {
      winnings = 0;
      resultMessage = "Battınız! Kaybettiniz 💥";
      isWin = false;
    }
    // Eğer oyuncu bust olmadıysa ve dealer bust olduysa
    else if (dealerScore > 21) {
      winnings = player.bet * 2;
      resultMessage = "Kurpiyer Battı! Kazandınız! 🎉";
      isWin = true;
    }
    // Her iki taraf da bust olmadıysa, skorları karşılaştır
    else {
      // Oyuncu bust olmadı ve dealer'dan yüksek skor aldı
      if (playerScore > dealerScore) {
        winnings = player.bet * 2;
        resultMessage = "Kazandınız! 🎉";
        isWin = true;
      }
      // Beraberlik durumu
      else if (playerScore === dealerScore) {
        winnings = player.bet; // Bahis iade
        resultMessage = "Berabere! 🤝";
        isWin = true; // Beraberliği kazanma sayıyoruz çünkü bahis iade ediliyor
      }
      // Dealer kazandı
      else {
        winnings = 0;
        resultMessage = "Kurpiyer Kazandı! 💔";
        isWin = false;
      }
    }

    setGameResult(resultMessage);
    setShowResult(true);
    setDealer(prev => prev.map(card => ({ ...card, hidden: false })));
    
    const updatedBalance = player.balance + winnings;
    
    setPlayer(prev => ({
      ...prev,
      balance: updatedBalance,
      isPlaying: false
    }));

    // Sadece kazanma durumunda otomatik yeni el başlat
    if (isWin && updatedBalance >= currentBet) {
      setTimeout(() => {
        startNewHand(updatedBalance, currentBet);
      }, 2000);
    }
  };

  // Yeni el başlatma fonksiyonu
  const startNewHand = (currentBalance: number, lastBet: number) => {
    setDeck(createDeck());
    setDealer([]);
    setShowResult(false);
    setGameResult("");
    
    // Split elini sıfırla
    setSplitHand([]);
    setSplitScore(0);
    setActiveSplitHand(false);
    
    setPlayer(prev => ({
      ...prev,
      hand: [],
      score: 0,
      balance: currentBalance,
      bet: lastBet,
      isPlaying: false
    }));

    if (lastBet <= currentBalance) {
      setCurrentBet(lastBet);
      startGame();
    } else {
      setCurrentBet(0);
      setGameState("betting");
    }
  };

  // Oyunu sıfırlama
  const resetGame = () => {
    setDeck(createDeck());
    setDealer([]);
    setShowResult(false);
    setGameResult("");
    
    // Split elini sıfırla
    setSplitHand([]);
    setSplitScore(0);
    setActiveSplitHand(false);
    
    setPlayer(prev => ({
      ...prev,
      hand: [],
      bet: 0,
      score: 0,
      isPlaying: false
    }));
    setGameState("betting");
    setCurrentBet(0);
  };

  // İlk yükleme
  useEffect(() => {
    setDeck(createDeck());
  }, []);

  // Split kontrolü
  const canSplit = () => {
    return player.hand.length === 2 && 
           typeof player.hand[0].value === typeof player.hand[1].value &&
           player.hand[0].value === player.hand[1].value &&
           player.balance >= player.bet;
  };

  // Double kontrolü
  const canDouble = () => {
    return player.hand.length === 2 && player.balance >= player.bet;
  };

  // Split işlemi
  const handleSplit = async () => {
    if (!canSplit()) return;

    // İkinci kartı split ele taşı
    const secondCard = player.hand[1];
    setSplitHand([secondCard]);
    
    // Ana elden ikinci kartı çıkar
    setPlayer(prev => ({
      ...prev,
      hand: [prev.hand[0]],
      balance: prev.balance - prev.bet,
      score: calculateScore([prev.hand[0]])
    }));

    // Her iki ele birer kart dağıt
    const newMainCard = await dealCardWithAnimation(false);
    const newSplitCard = await dealCardWithAnimation(false);

    setPlayer(prev => ({
      ...prev,
      hand: [...prev.hand, newMainCard],
      score: calculateScore([...prev.hand, newMainCard])
    }));

    setSplitHand(prev => [...prev, newSplitCard]);
    setSplitScore(calculateScore([secondCard, newSplitCard]));
  };

  // Double işlemi
  const handleDouble = async () => {
    if (!canDouble()) return;

    // Bahisi ikiye katla
    setPlayer(prev => ({
      ...prev,
      balance: prev.balance - prev.bet,
      bet: prev.bet * 2
    }));

    // Bir kart daha çek ve tur biter
    const newCard = await dealCardWithAnimation(false);
    const newHand = [...player.hand, newCard];
    const newScore = calculateScore(newHand);

    setPlayer(prev => ({
      ...prev,
      hand: newHand,
      score: newScore
    }));

    if (newScore > 21) {
      setGameResult("Bust! You Lost 💥");
      setShowResult(true);
      endGame();
    } else {
      stand();
    }
  };

  // Bet input'unu düzelt
  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/^0+/, ''); // Baştaki sıfırları kaldır
    const betValue = value === '' ? 0 : parseInt(value);
    setCurrentBet(Math.min(betValue, player.balance)); // Maximum balance kadar
  };

  // Bahis koyma işlemini güncelle
  const handlePlaceBet = () => {
    setPendingBet(currentBet);
    setShowAgeConfirmation(true);
  };

  // Yaş onayı sonrası oyunu başlat
  const handleAgeConfirmation = () => {
    setShowAgeConfirmation(false);
    startGame();
  };

  // Yaş onayı iptal
  const handleAgeCancel = () => {
    setShowAgeConfirmation(false);
    setPendingBet(0);
  };

  return (
    <div className="w-full min-h-screen bg-zinc-900 p-2 sm:p-8 rounded-xl border border-red-900/30 shadow-2xl relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5 rounded-xl"></div>

      {/* Dealer Alanı */}
      <div className="relative z-10 mb-6 sm:mb-12">
        <h2 className="text-red-500 mb-4 sm:mb-6 text-lg sm:text-xl font-semibold text-center">
          Kurpiyer ({calculateScore(dealer)})
        </h2>
        <div className="flex gap-2 sm:gap-4 justify-center overflow-x-auto pb-2">
          <AnimatePresence>
            {dealer.map((card, index) => (
              <motion.div
                key={index}
                initial={{ y: -1000, opacity: 0, rotateZ: -180 }}
                animate={{ y: 0, opacity: 1, rotateZ: 0 }}
                exit={{ y: 1000, opacity: 0, rotateZ: 180 }}
                transition={{ 
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: index * 0.2
                }}
                className={`flex-shrink-0 w-20 h-28 sm:w-32 sm:h-48 rounded-lg ${
                  card.hidden 
                    ? "bg-gradient-to-br from-red-900 to-red-950 border-red-800" 
                    : "bg-zinc-800"
                } border border-zinc-700 shadow-xl flex items-center justify-center`}
              >
                {!card.hidden && (
                  <span className={`text-lg sm:text-2xl ${
                    card.suit === "hearts" || card.suit === "diamonds" 
                      ? "text-red-500" 
                      : "text-white"
                  }`}>
                    {`${card.value} ${
                      card.suit === "hearts" ? "♥" :
                      card.suit === "diamonds" ? "♦" :
                      card.suit === "clubs" ? "♣" : "♠"
                    }`}
                  </span>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Oyuncu Alanı */}
      <div className="relative z-10">
        <h2 className="text-white mb-4 sm:mb-6 text-lg sm:text-xl font-semibold flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>Oyuncu ({player.score})</span>
          <span className="text-red-500">Bakiye: ${player.balance}</span>
        </h2>
        <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-8 justify-center overflow-x-auto pb-2">
          <AnimatePresence>
            {player.hand.map((card, index) => (
              <motion.div
                key={index}
                initial={{ y: 1000, opacity: 0, rotateZ: 180 }}
                animate={{ y: 0, opacity: 1, rotateZ: 0 }}
                exit={{ y: -1000, opacity: 0, rotateZ: -180 }}
                transition={{ 
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: index * 0.2
                }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                className="flex-shrink-0 w-20 h-28 sm:w-32 sm:h-48 bg-zinc-800 rounded-lg border border-zinc-700 
                shadow-xl flex items-center justify-center"
              >
                <span className={`text-lg sm:text-2xl ${
                  card.suit === "hearts" || card.suit === "diamonds" 
                    ? "text-red-500" 
                    : "text-white"
                }`}>
                  {`${card.value} ${
                    card.suit === "hearts" ? "♥" :
                    card.suit === "diamonds" ? "♦" :
                    card.suit === "clubs" ? "♣" : "♠"
                  }`}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Split El */}
        {splitHand.length > 0 && (
          <div className="mt-4 sm:mt-8">
            <h2 className="text-white mb-4 sm:mb-6 text-lg sm:text-xl font-semibold text-center">
              Bölünmüş El ({splitScore})
            </h2>
            <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-8 justify-center overflow-x-auto pb-2">
              <AnimatePresence>
                {splitHand.map((card, index) => (
                  <motion.div
                    key={`split-${index}`}
                    initial={{ y: 1000, opacity: 0, rotateZ: 180 }}
                    animate={{ y: 0, opacity: 1, rotateZ: 0 }}
                    exit={{ y: -1000, opacity: 0, rotateZ: -180 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      delay: index * 0.2
                    }}
                    whileHover={{ scale: 1.05 }}
                    className="flex-shrink-0 w-20 h-28 sm:w-32 sm:h-48 bg-zinc-800 rounded-lg border border-zinc-700 shadow-xl 
                    flex items-center justify-center"
                  >
                    <span className={`text-lg sm:text-2xl ${
                      card.suit === "hearts" || card.suit === "diamonds" 
                        ? "text-red-500" 
                        : "text-white"
                    }`}>
                      {`${card.value} ${
                        card.suit === "hearts" ? "♥" :
                        card.suit === "diamonds" ? "♦" :
                        card.suit === "clubs" ? "♣" : "♠"
                      }`}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Kontroller */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-4">
          {gameState === "betting" && (
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center w-full sm:w-auto">
              <input
                type="number"
                value={currentBet || ''}
                onChange={handleBetChange}
                className="p-2 sm:p-3 rounded bg-zinc-800 border border-zinc-700 text-white w-full sm:w-32 text-center"
                min={0}
                max={player.balance}
                placeholder="0"
              />
              <Button 
                onClick={handlePlaceBet}
                className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-8 w-full sm:w-auto"
                disabled={currentBet <= 0 || currentBet > player.balance}
              >
                Bahis Koy
              </Button>
            </div>
          )}

          {gameState === "playerTurn" && (
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
              <Button 
                onClick={hit}
                className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-8"
              >
                Kart Çek
              </Button>
              <Button 
                onClick={stand}
                className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 sm:px-8"
              >
                Dur
              </Button>
              {canSplit() && (
                <Button 
                  onClick={handleSplit}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 sm:px-8"
                >
                  Böl
                </Button>
              )}
              {canDouble() && (
                <Button 
                  onClick={handleDouble}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-8"
                >
                  İkiye Katla
                </Button>
              )}
            </div>
          )}

          {gameState === "gameOver" && !gameResult.includes("Kazandınız") && !gameResult.includes("Berabere") && (
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-4">
              <Button 
                onClick={resetGame}
                className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-8"
              >
                Yeni Bahis
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Sonuç Gösterimi */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center z-20"
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="bg-black/80 px-8 py-6 rounded-xl border border-red-500"
            >
              <h3 className={`text-4xl font-bold ${
                gameResult.includes("Kazandınız") || gameResult.includes("BLACKJACK")
                  ? "text-red-500"
                  : gameResult.includes("Berabere")
                  ? "text-yellow-500"
                  : "text-zinc-400"
              }`}>
                {gameResult}
              </h3>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Yaş Doğrulama Dialog'u */}
      <ConfirmationDialog
        open={showAgeConfirmation}
        onConfirm={handleAgeConfirmation}
        onCancel={handleAgeCancel}
      />
    </div>
  );
} 