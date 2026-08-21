import { declareIndexPlugin, type ReactRNPlugin, WidgetLocation } from '@remnote/plugin-sdk';

async function onActivate(plugin: ReactRNPlugin) {
  await plugin.settings.registerNumberSetting({
    id: 'warn-seconds',
    title: 'Aviso visual amarillo desde (segundos)',
    defaultValue: 15,
  });

  await plugin.settings.registerNumberSetting({
    id: 'slow-seconds',
    title: 'Aviso visual rojo desde (segundos)',
    defaultValue: 30,
  });

  await plugin.settings.registerBooleanSetting({
    id: 'show-decimals',
    title: 'Mostrar décimas de segundo',
    defaultValue: false,
  });

  await plugin.app.registerWidget('card_stopwatch', WidgetLocation.QueueToolbar, {
  dimensions: { height: 30, width: 84 },
});
}

async function onDeactivate(_: ReactRNPlugin) {}

declareIndexPlugin(onActivate, onDeactivate);
