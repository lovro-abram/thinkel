package com.github.lovro_abram.thinkel

import android.app.AlarmManager
import android.app.PendingIntent
import android.app.WallpaperManager
import android.content.Context
import android.content.Intent
import android.graphics.BitmapFactory
import android.util.Base64
import android.webkit.JavascriptInterface
import android.webkit.WebView
import android.widget.Toast
import java.util.*

class WebAppInterface(private val mContext: Context, private val webView: WebView) {

    @JavascriptInterface
    fun showToast(message: String) {
        Toast.makeText(mContext, message, Toast.LENGTH_SHORT).show()
    }

    @JavascriptInterface
    fun scheduleNotification(hour: Int, minute: Int) {
        // Store for persistence on boot
        val prefs = mContext.getSharedPreferences("ThinkelPrefs", Context.MODE_PRIVATE)
        prefs.edit().apply {
            putInt("notif_hour", hour)
            putInt("notif_min", minute)
            putBoolean("notif_enabled", true)
            apply()
        }

        val alarmManager = mContext.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val intent = Intent(mContext, NotificationReceiver::class.java)
        val pendingIntent = PendingIntent.getBroadcast(
            mContext, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val calendar = Calendar.getInstance().apply {
            set(Calendar.HOUR_OF_DAY, hour)
            set(Calendar.MINUTE, minute)
            set(Calendar.SECOND, 0)
            if (before(Calendar.getInstance())) {
                add(Calendar.DAY_OF_YEAR, 1)
            }
        }

        alarmManager.setRepeating(
            AlarmManager.RTC_WAKEUP,
            calendar.timeInMillis,
            AlarmManager.INTERVAL_DAY,
            pendingIntent
        )
    }

    @JavascriptInterface
    fun setWallpaper(base64Image: String) {
        try {
            val decodedString = Base64.decode(base64Image, Base64.DEFAULT)
            val decodedByte = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.size)
            val wallpaperManager = WallpaperManager.getInstance(mContext)
            wallpaperManager.setBitmap(decodedByte)

            webView.post {
                // If in wallpaper editor, t() might not exist or work the same.
                // We'll use a direct message or check if t exists.
                webView.evaluateJavascript("if (typeof t === 'function') { showToast(t('wallpaper_set_success')) } else { showToast('Ozadje nastavljeno!') }", null)
            }
        } catch (e: Exception) {
            e.printStackTrace()
            webView.post {
                webView.evaluateJavascript("showToast('Error setting wallpaper')", null)
            }
        }
    }

    @JavascriptInterface
    fun syncLanguage(lang: String) {
        val prefs = mContext.getSharedPreferences("ThinkelPrefs", Context.MODE_PRIVATE)
        prefs.edit().putString("lang", lang).apply()
    }

    @JavascriptInterface
    fun updateWidget(text: String, author: String) {
        val prefs = mContext.getSharedPreferences("ThinkelPrefs", Context.MODE_PRIVATE)
        prefs.edit().apply {
            putString("widget_quote", text)
            putString("widget_author", author)
            apply()
        }

        // Trigger widget update
        val intent = Intent(mContext, QuoteWidgetProvider::class.java).apply {
            action = "android.appwidget.action.APPWIDGET_UPDATE"
        }
        mContext.sendBroadcast(intent)
    }
}
