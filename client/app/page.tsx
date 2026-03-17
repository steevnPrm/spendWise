"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard, Send, X, Wallet, ArrowRight,
  Clock, ArrowUpRight, ArrowDownLeft, CheckCircle2
} from 'lucide-react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  amount: number;
}

interface Transaction {
  userId: string;
  amount: number;
  date: string;
}

export default function FintechDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [history, setHistory] = useState<Transaction[]>([]);
  const [senderId, setSenderId] = useState<string | null>(null);
  const [receiverId, setReceiverId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Initialisation des données
  const fetchData = async () => {
    const [resUsers, resHistory] = await Promise.all([
      fetch('/api/users'),
      fetch('/api/history')
    ]);
    const usersData = await resUsers.json();
    const historyData = await resHistory.json();

    setUsers(usersData);
    if (historyData.success) setHistory(historyData.history.reverse());
  };

  useEffect(() => { fetchData(); }, []);

  const handleCardClick = (id: string) => {
    if (!senderId) {
      setSenderId(id);
    } else if (senderId === id) {
      setSenderId(null);
      setReceiverId(null);
    } else {
      setReceiverId(id);
      setIsModalOpen(true);
    }
  };

  const executeTransaction = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setLoading(true);

    try {
      const res = await fetch('/api/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId,
          receiverId,
          amount: parseFloat(amount)
        })
      });

      const data = await res.json();

      if (res.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          closeModal();
          fetchData();
        }, 2000);
      } else {
        alert(`Erreur : ${data.error}`);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSenderId(null);
    setReceiverId(null);
    setAmount("");
  };

  const sender = users.find(u => u.id === senderId);
  const receiver = users.find(u => u.id === receiverId);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-emerald-500/30 pb-20">

      {/* --- HEADER --- */}
      <header className="p-8 max-w-7xl mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-emerald-500">SPENWISE.</h1>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">Fintech Protocol v1.0</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-full flex items-center gap-3">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-mono text-slate-400">
            {senderId ? (receiverId ? "READY" : "WAITING FOR RECEIVER") : "SELECT SENDER"}
          </span>
        </div>
      </header>

      {/* --- MAIN DASHBOARD --- */}
      <main className="max-w-7xl mx-auto px-8 py-10">
        <div className="text-center mb-12">
          <h2 className="text-slate-500 text-sm font-semibold mb-2">
            {senderId ? "Étape 2 : Ciblez le destinataire" : "Étape 1 : Sélectionnez l'expéditeur"}
          </h2>
          <div className="h-1 w-20 bg-emerald-500/20 mx-auto rounded-full overflow-hidden">
            <motion.div
              animate={{ x: senderId ? 0 : -80 }}
              className="h-full w-full bg-emerald-500"
            />
          </div>
        </div>

        {/* --- CARDS GRID --- */}
        <div className="flex flex-wrap justify-center gap-8 perspective-1000">
          {users.map((user) => {
            const isSender = senderId === user.id;
            const isReceiver = receiverId === user.id;
            const isInactive = senderId && !isSender && !isReceiver && receiverId;

            return (
              <motion.div
                key={user.id}
                layout
                onClick={() => !isInactive && handleCardClick(user.id)}
                animate={{
                  scale: isSender || isReceiver ? 1.05 : 0.95,
                  y: isSender ? -15 : (isReceiver ? 15 : 0),
                  opacity: isInactive ? 0.4 : 1,
                  rotateX: isSender ? 5 : 0
                }}
                className={`w-80 p-8 rounded-[2.5rem] border-2 cursor-pointer transition-all duration-500
                  ${isSender ? 'bg-slate-800 border-emerald-500 shadow-2xl shadow-emerald-500/10' :
                    isReceiver ? 'bg-slate-800 border-blue-500 shadow-2xl shadow-blue-500/10' :
                      'bg-slate-900/40 border-slate-800 hover:border-slate-700'}`}
              >
                <div className="flex justify-between items-start mb-12">
                  <div className={`p-3 rounded-2xl ${isSender ? 'bg-emerald-500/10' : isReceiver ? 'bg-blue-500/10' : 'bg-slate-800'}`}>
                    <CreditCard size={20} className={isSender ? "text-emerald-400" : isReceiver ? "text-blue-400" : "text-slate-500"} />
                  </div>
                  <span className="text-[10px] font-mono text-slate-600 font-bold uppercase tracking-widest">
                    ID: {user.id.slice(0, 4)}
                  </span>
                </div>

                <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter mb-1">Solde Actuel</p>
                <p className="text-3xl font-bold tracking-tight mb-6">{user.amount.toLocaleString('fr-FR')} €</p>

                <div className="pt-4 border-t border-slate-800/50">
                  <p className="text-sm font-semibold text-slate-300">{user.firstName} {user.lastName}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* --- RECENT ACTIVITY --- */}
        <section className="max-w-2xl mx-auto mt-24">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Clock size={18} className="text-emerald-500" />
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Journal des flux</h3>
            </div>
            <span className="text-[10px] text-slate-600 font-mono">LIVE_FEED</span>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {history.slice(0, 5).map((log, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group bg-slate-900/30 border border-slate-800/50 p-5 rounded-3xl flex items-center justify-between hover:bg-slate-900/60 transition-colors"
                >
                  <div className="flex items-center gap-5">
                    <div className={`p-3 rounded-2xl ${log.amount > 0 ? 'bg-emerald-500/5 text-emerald-500' : 'bg-rose-500/5 text-rose-500'}`}>
                      {log.amount > 0 ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-200">
                        {log.amount > 0 ? "Réception de fonds" : "Transfert émis"}
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono">{new Date(log.date).toLocaleString()}</p>
                    </div>
                  </div>
                  <p className={`font-mono font-bold text-lg ${log.amount > 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {log.amount > 0 ? '+' : ''}{log.amount.toFixed(2)} €
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      </main>

      {/* --- TRANSACTION MODAL --- */}
      <AnimatePresence>
        {isModalOpen && sender && receiver && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/95 backdrop-blur-xl z-[100] flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }}
              className="bg-slate-900 border border-slate-800 p-10 rounded-[3.5rem] w-full max-w-md relative shadow-2xl"
            >
              {showSuccess ? (
                <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="flex flex-col items-center py-10">
                  <CheckCircle2 size={80} className="text-emerald-500 mb-6" />
                  <h2 className="text-2xl font-bold">Transfert Réussi</h2>
                  <p className="text-slate-500 mt-2">Le registre a été mis à jour.</p>
                </motion.div>
              ) : (
                <>
                  <button onClick={closeModal} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors">
                    <X size={24} />
                  </button>

                  <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-[1.5rem] flex items-center justify-center text-emerald-500 mb-6">
                      <Wallet size={32} />
                    </div>
                    <h2 className="text-xl font-bold mb-1">Confirmation</h2>
                    <p className="text-slate-500 text-sm">Virement P2P sécurisé</p>
                  </div>

                  <div className="flex items-center justify-between bg-slate-950/50 p-6 rounded-[2rem] border border-slate-800 mb-8">
                    <div className="text-center">
                      <p className="text-[9px] text-slate-600 uppercase font-black tracking-widest mb-1">Débit</p>
                      <p className="font-bold text-emerald-400">{sender.firstName}</p>
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-r from-emerald-500/50 to-blue-500/50 mx-4" />
                    <div className="text-center">
                      <p className="text-[9px] text-slate-600 uppercase font-black tracking-widest mb-1">Crédit</p>
                      <p className="font-bold text-blue-400">{receiver.firstName}</p>
                    </div>
                  </div>

                  <div className="relative mb-10">
                    <input
                      autoFocus type="number" value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-slate-950 border-2 border-slate-800 rounded-3xl p-8 text-4xl text-center font-bold text-white focus:border-emerald-500 outline-none transition-all"
                    />
                    <span className="absolute right-8 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-700">€</span>
                  </div>

                  <button
                    disabled={loading || !amount}
                    onClick={executeTransaction}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 py-6 rounded-[2rem] font-bold text-white shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-3 transition-all active:scale-95"
                  >
                    {loading ? "Calcul en cours..." : <><Send size={20} /> Autoriser le transfert</>}
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}