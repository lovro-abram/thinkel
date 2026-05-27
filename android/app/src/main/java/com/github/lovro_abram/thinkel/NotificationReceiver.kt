package com.github.lovro_abram.thinkel

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

class NotificationReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val notificationHelper = NotificationHelper(context)

        // Use localized text based on device settings or stored pref
        val prefs = context.getSharedPreferences("ThinkelPrefs", Context.MODE_PRIVATE)
        val lang = prefs.getString("lang", "sl")

        val title = if (lang == "sl") "Nov dnevni citat!" else "New daily quote!"
        val message = if (lang == "sl") "Preberi današnji navdih in zapiši svoje misli." else "Read today's inspiration and write down your thoughts."

        notificationHelper.sendNotification(title, message)
    }
}
