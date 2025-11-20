// ----------------------------
// Views registry untuk ZapTools MVVM + Alpine.js
// ----------------------------

// Import Templates
import { HomeTemplate } from "./views/templates/home.js";
import { ToolsTemplate } from "./views/templates/tools.js";
import { ConverterTemplate } from "./views/templates/converter.js";
import { HistoryTemplate } from "./views/templates/history.js";
import { FeaturesTemplate } from "./views/templates/features.js";
import { PasswordGeneratorTemplate } from "./views/templates/password-generator.js";
import { ImageConverterTemplate } from "./views/templates/image-converter.js";
import { ColorToolsTemplate } from "./views/templates/color-tools.js";
import { SettingsTemplate } from "./views/templates/settings.js";
import { TextConverterTemplate } from "./views/templates/text-converter.js";

// Import ViewModels
import { HomeViewModel } from "./viewmodels/home.vm.js";
import { ToolsViewModel } from "./viewmodels/tools.vm.js";
import { ConverterViewModel } from "./viewmodels/converter.vm.js";
import { HistoryViewModel } from "./viewmodels/history.vm.js";
import { FeaturesViewModel } from "./viewmodels/features.vm.js";
import { PasswordGeneratorViewModel } from "./viewmodels/password-generator.vm.js";
import { ImageConverterViewModel } from "./viewmodels/image-converter.vm.js";
import { ColorToolsViewModel } from "./viewmodels/color-tools.vm.js";
import { SettingsViewModel } from "./viewmodels/settings.vm.js";
import { TextConverterViewModel } from "./viewmodels/text-converter.vm.js";

// ----------------------------
// Daftar route => { template, viewmodel }
// ----------------------------

export const views = {
    "/home": {
        template: HomeTemplate,
        viewmodel: HomeViewModel
    },

    "/tools": {
        template: ToolsTemplate,
        viewmodel: ToolsViewModel
    },

    "/converter": {
        template: ConverterTemplate,
        viewmodel: ConverterViewModel
    },

    "/history": {
        template: HistoryTemplate,
        viewmodel: HistoryViewModel
    },

    "/features": {
        template: FeaturesTemplate,
        viewmodel: FeaturesViewModel
    },

    "/password-generator": {
        template: PasswordGeneratorTemplate,
        viewmodel: PasswordGeneratorViewModel
    },

    "/image-converter": {
        template: ImageConverterTemplate,
        viewmodel: ImageConverterViewModel
    },

    "/color-tools": {
        template: ColorToolsTemplate,
        viewmodel: ColorToolsViewModel
    },

    "/settings": {
        template: SettingsTemplate,
        viewmodel: SettingsViewModel
    },

    "/text-converter": {
        template: TextConverterTemplate,
        viewmodel: TextConverterViewModel
    }
};