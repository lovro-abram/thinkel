package com.github.lovro_abram.thinkel

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews

class QuoteWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }
    }

    override fun onReceive(context: Context, intent: Intent) {
        super.onReceive(context, intent)
        val appWidgetManager = AppWidgetManager.getInstance(context)
        val thisAppWidget = ComponentName(context.packageName, QuoteWidgetProvider::class.java.name)
        val appWidgetIds = appWidgetManager.getAppWidgetIds(thisAppWidget)
        onUpdate(context, appWidgetManager, appWidgetIds)
    }

    private fun updateAppWidget(context: Context, appWidgetManager: AppWidgetManager, appWidgetId: Int) {
        val prefs = context.getSharedPreferences("ThinkelPrefs", Context.MODE_PRIVATE)
        val quote = prefs.getString("widget_quote", "Thinkel")
        val author = prefs.getString("widget_author", "")

        val views = RemoteViews(context.packageName, R.layout.widget_layout)
        views.setTextViewText(R.id.widget_quote_text, "\"$quote\"")
        views.setTextViewText(R.id.widget_author_text, author)

        val intent = Intent(context, MainActivity::class.java)
        val pendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
        views.setOnClickPendingIntent(R.id.widget_container, pendingIntent)

        appWidgetManager.updateAppWidget(appWidgetId, views)
    }
}
