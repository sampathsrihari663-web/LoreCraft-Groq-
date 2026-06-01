import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { supabase } from './supabaseClient';

export function Hero({ onAuth }: { onAuth: (name: string) => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [adventurerName, setAdventurerName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleAuth = async () => {
    setErrorMsg('');
    setSignupSuccess(false);
    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (!data.session) {
          setErrorMsg('Could not establish a session. Please confirm your email.');
          return;
        }
        // Proceed with user metadata or default
        onAuth(data.user?.user_metadata?.name || "Wandering Adventurer");
      } else {
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: { data: { name: adventurerName || "Wandering Adventurer" } }
        });
        if (error) throw error;
        
        // Success flow: return to login, prefill email, clear password
        setIsLogin(true);
        setSignupSuccess(true);
        setPassword('');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants: any = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, opacity: 1, 
      transition: { type: 'spring', stiffness: 100, damping: 15 } 
    }
  };

  return (
    <div ref={scrollRef} style={{ height: '100vh', background: 'var(--color-bg2)', display: 'flex', flexDirection: 'column', position: 'relative', overflowX: 'hidden', overflowY: 'auto', scrollBehavior: 'smooth' }}>
      
      {/* Hero Content */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 24px', position: 'relative', minHeight: '100vh' }}>
        {/* Background accents */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'radial-gradient(var(--color-border2) 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.1, pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 60%)', filter: 'blur(40px)', pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 60%)', filter: 'blur(40px)', pointerEvents: 'none' }}></div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ maxWidth: '800px', width: '100%', textAlign: 'center', zIndex: 1 }}
        >
            <motion.div variants={itemVariants} style={{ display: 'inline-block', padding: '8px 16px', background: 'var(--color-bg3)', border: '1px solid var(--color-border)', borderRadius: '24px', fontSize: '13px', color: 'var(--color-gold)', marginBottom: '32px', letterSpacing: '0.05em', fontFamily: 'var(--font-cinzel)', textTransform: 'uppercase' }}>
              The Ultimate Coding RPG
            </motion.div>
            
            <motion.h1 variants={itemVariants} style={{ fontSize: 'clamp(48px, 8vw, 72px)', fontWeight: '800', color: 'var(--color-ink2)', lineHeight: '1.05', marginBottom: '24px', letterSpacing: '-0.03em', fontFamily: 'var(--font-cinzel)' }}>
              Code your way to <br /><span style={{ color: 'var(--color-gold)', textShadow: '0 0 30px rgba(201,168,76,0.3)' }}>Victory.</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} style={{ fontSize: '20px', color: 'var(--color-slate)', lineHeight: '1.6', marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px auto' }}>
              Master core programming concepts by defeating epic bosses. Level up your coding skills through immersive, practical combat challenges designed for beginners and experts alike.
            </motion.p>

            <motion.div variants={itemVariants} style={{ background: 'rgba(23, 23, 23, 0.7)', backdropFilter: 'blur(10px)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '40px 32px', maxWidth: '420px', margin: '0 auto', boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)' }}>
                <h2 style={{ fontSize: '24px', color: 'var(--color-ink2)', marginBottom: '24px', fontFamily: 'var(--font-cinzel)' }}>{isLogin ? 'Welcome Back, Hero' : 'Begin Your Journey'}</h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {isLogin && signupSuccess && (
                    <div style={{ color: '#10b981', fontSize: '14px', padding: '12px', background: 'rgba(16,185,129,0.1)', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.3)', lineHeight: '1.5' }}>
                      Your account has been created. Please check your email and verify your address before logging in.
                    </div>
                  )}
                  {!isLogin && (
                    <input 
                      type="text" 
                      placeholder="Your Adventurer Name" 
                      value={adventurerName}
                      onChange={(e) => setAdventurerName(e.target.value)}
                      style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border2)', borderRadius: '8px', color: 'var(--color-ink2)', outline: 'none', transition: 'border-color 0.2s', fontSize: '15px' }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--color-gold)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--color-border2)'}
                    />
                  )}
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border2)', borderRadius: '8px', color: 'var(--color-ink2)', outline: 'none', transition: 'border-color 0.2s', fontSize: '15px' }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--color-gold)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--color-border2)'}
                  />
                  <input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--color-border2)', borderRadius: '8px', color: 'var(--color-ink2)', outline: 'none', transition: 'border-color 0.2s', fontSize: '15px' }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--color-gold)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--color-border2)'}
                  />
                  
                  {errorMsg && (
                    <div style={{ color: '#ef4444', fontSize: '14px', marginTop: '4px' }}>
                      {errorMsg}
                    </div>
                  )}

                  <button 
                    onClick={handleAuth}
                    style={{ width: '100%', padding: '14px', background: 'var(--color-gold)', color: '#111', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '8px', fontSize: '16px', transition: 'all 0.2s', boxShadow: '0 4px 15px rgba(201,168,76,0.3)' }}
                    onMouseOver={(e) => { e.currentTarget.style.background = '#e3c25b'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                    onMouseOut={(e) => { e.currentTarget.style.background = 'var(--color-gold)'; e.currentTarget.style.transform = 'translateY(0)' }}
                  >
                    {isLogin ? 'Enter The Realm' : 'Claim Your Sword (Sign Up)'}
                  </button>
                </div>

                <div style={{ marginTop: '24px', fontSize: '14px', color: 'var(--color-slate)' }}>
                  {isLogin ? "Don't have an account? " : "Already forged your legacy? "}
                  <span 
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setSignupSuccess(false);
                      setErrorMsg('');
                    }} 
                    style={{ color: 'var(--color-gold)', cursor: 'pointer', fontWeight: 'bold', transition: 'color 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
                    onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
                  >
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </span>
                </div>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1, repeat: Infinity, repeatType: "reverse" }}
              style={{ marginTop: '64px', color: 'var(--color-slate)', cursor: 'pointer' }}
              onClick={() => {
                const aboutSection = document.getElementById('about-section');
                if (aboutSection) {
                   aboutSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <div style={{ fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px', fontFamily: 'var(--font-cinzel)' }}>Discover More</div>
              <div>↓</div>
            </motion.div>
        </motion.div>
      </div>

      {/* About Section */}
      <div id="about-section" style={{ background: 'var(--color-bg3)', padding: '100px 24px', borderTop: '1px solid var(--color-border)', zIndex: 1, position: 'relative' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              style={{ fontSize: '40px', color: 'var(--color-gold)', textAlign: 'center', marginBottom: '16px', fontFamily: 'var(--font-cinzel)' }}
            >
              What is LoreCraft?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.1 }}
              style={{ textAlign: 'center', color: 'var(--color-slate)', fontSize: '18px', maxWidth: '600px', margin: '0 auto 64px auto', lineHeight: '1.6' }}
            >
              An innovative learning platform disguised as an old-school RPG. Instead of blindly reading documentation, you actively recall concepts under pressure in dynamic combat scenarios guided by AI.
            </motion.p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: 0.2 }}
                style={{ background: 'var(--color-bg2)', padding: '40px 32px', borderRadius: '16px', border: '1px solid var(--color-border2)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', cursor: 'default', position: 'relative', overflow: 'hidden' }}
                whileHover={{ y: -5, borderColor: 'rgba(201,168,76,0.3)' }}
              >
                <div style={{ position: 'absolute', top: '-20%', right: '-10%', fontSize: '120px', opacity: 0.03, pointerEvents: 'none' }}>🤖</div>
                <div style={{ fontSize: '40px', marginBottom: '24px', color: 'var(--color-gold)' }}>🤖</div>
                <h3 style={{ fontSize: '22px', color: 'var(--color-ink2)', marginBottom: '12px', fontFamily: 'var(--font-cinzel)' }}>AI-Powered Combat</h3>
                <p style={{ color: 'var(--color-slate)', lineHeight: '1.7' }}>
                  Face unique bosses equipped with dynamic question generation powered by advanced AI models. Every encounter is fresh and strictly tests the current module.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: 0.3 }}
                style={{ background: 'var(--color-bg2)', padding: '40px 32px', borderRadius: '16px', border: '1px solid var(--color-border2)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', cursor: 'default', position: 'relative', overflow: 'hidden' }}
                whileHover={{ y: -5, borderColor: 'rgba(59,130,246,0.3)' }}
              >
                <div style={{ position: 'absolute', top: '-20%', right: '-10%', fontSize: '120px', opacity: 0.03, pointerEvents: 'none' }}>🌐</div>
                <div style={{ fontSize: '40px', marginBottom: '24px', color: '#3b82f6' }}>🌐</div>
                <h3 style={{ fontSize: '22px', color: 'var(--color-ink2)', marginBottom: '12px', fontFamily: 'var(--font-cinzel)' }}>Multi-Language Support</h3>
                <p style={{ color: 'var(--color-slate)', lineHeight: '1.7' }}>
                  Whether you are learning Java, Python, C++, C# or C, LoreCraft adapts to your preferred journey. Master the syntax, theory and nuances of your chosen code.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: 0.4 }}
                style={{ background: 'var(--color-bg2)', padding: '40px 32px', borderRadius: '16px', border: '1px solid var(--color-border2)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', cursor: 'default', position: 'relative', overflow: 'hidden' }}
                whileHover={{ y: -5, borderColor: 'rgba(16,185,129,0.3)' }}
              >
                <div style={{ position: 'absolute', top: '-20%', right: '-10%', fontSize: '120px', opacity: 0.03, pointerEvents: 'none' }}>🎖️</div>
                <div style={{ fontSize: '40px', marginBottom: '24px', color: '#10b981' }}>🎖️</div>
                <h3 style={{ fontSize: '22px', color: 'var(--color-ink2)', marginBottom: '12px', fontFamily: 'var(--font-cinzel)' }}>RPG Progression</h3>
                <p style={{ color: 'var(--color-slate)', lineHeight: '1.7' }}>
                  Gain XP, gold, and powerful artifacts. Level up your profile, equip rare items in the tavern, and show off your prestige in your local Guild Room rankings.
                </p>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              style={{ marginTop: '80px', textAlign: 'center', maxWidth: '700px', margin: '80px auto 0 auto', color: 'var(--color-slate)', lineHeight: '1.8' }}
            >
              <button 
                onClick={() => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
                style={{ padding: '14px 32px', background: 'transparent', color: 'var(--color-gold)', border: '1px solid var(--color-gold)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', transition: 'all 0.2s', fontFamily: 'var(--font-cinzel)', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(201,168,76,0.1)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(201,168,76,0.2)' }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none' }}
              >
                Start Your Epic Journey
              </button>
            </motion.div>
          </div>
      </div>
    </div>
  );
}
