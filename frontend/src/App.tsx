import React, { useState, useEffect } from "react"
import { Clicker } from "./components/Clicker/Clicker"
import ReactGA from "react-ga"
import { type Metric, onCLS, onFID, onLCP } from "web-vitals"
import "./styles/global.scss"
import styles from "./App.module.scss"
import { useTelegram } from "./hooks/useTelegram"
import { MOCK_TELEGRAM } from "./utils/config"
import { ResourceCounter } from "./components/ResourceCounter"
import { MainObject } from "./components/MainObject"
import { Payment } from "./components/Payment"
import { ProgressBar } from "./components/ProgressBar"
// دالة تشغيل إعلان Adsgram الخاص بك
const showMyAd = () => {
  if (window.Adsgram) {
    window.Adsgram.init({ blockId: "19316" }).show()
      .then(() => alert("مبروك! ربحت مكافأة المشاهدة"))
      .catch((err) => console.error("عذراً، فشل تحميل الإعلان", err));
  }
};

import { Upgrades } from "./components/Upgrades"

const TRACKING_ID = "UA-XXXXXXXXX-X"
ReactGA.initialize(TRACKING_ID)

export const App = () => {
  const { user, webApp, isTelegram } = useTelegram()

  const [coins, setCoins] = useState(0)
  const [crystals, setCrystals] = useState(0)
  const [energy, setEnergy] = useState(100)
  const [progress, setProgress] = useState(0)

  const handleClick = () => {
    setCoins((prev) => prev + 1)
    setProgress((prev) => (prev + 1) % 100)
  }

  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search)
  }, [])

  useEffect(() => {
    const sendToGoogleAnalytics = ({ name, delta, id }: Metric) => {
      ReactGA.event({
        category: "Web Vitals",
        action: name,
        value: Math.round(name === "CLS" ? delta * 1000 : delta),
        label: id,
        nonInteraction: true,
      })
    }

    onCLS(sendToGoogleAnalytics)
    onFID(sendToGoogleAnalytics)
    onLCP(sendToGoogleAnalytics)
  }, [])

  if (!isTelegram && !MOCK_TELEGRAM) {
    return (
      <div className={styles.error}>
        <h1>Please open this app in Telegram.</h1>
        <p>This application is designed to work only within Telegram Mini Apps.</p>
      </div>
    )
  }

  return (
      <div className={styles.gameScreen}>
      <div className={styles.container}>
        {/* زر الإعلانات الخاص بك يوضع هنا */}
        <button 
          onClick={showMyAd} 
          style={{
            width: '100%',
            padding: '15px',
            backgroundColor: '#FFD700',
            color: '#000',
            fontWeight: 'bold',
            borderRadius: '10px',
            border: 'none',
            marginBottom: '20px',
            fontSize: '16px'
          }}
        >
          📺 شاهد إعلان واربح 1000 نقطة
        </button>

        <ResourceCounter coins={coins} crystals={crystals} energy={energy} />
      <MainObject />
      <Clicker onClick={handleClick} />
      <Payment webApp={webApp} />
      <ProgressBar progress={progress} />
      <Upgrades />
    </div>
  )
}
