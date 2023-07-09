import '@quasar/extras/animate/fadeIn.css';
import '@quasar/extras/animate/fadeOut.css';
import '@quasar/extras/bootstrap-icons/bootstrap-icons.css';
import '@quasar/extras/material-icons/material-icons.css';
import {
	ComponentConstructor,
	Dialog,
	Notify,
	QBtn,
	QBtnDropdown,
	QCard,
	QField,
	QImg,
	QInnerLoading,
	QInput,
	QRouteTab,
	QSelect,
	QTable,
	Quasar,
} from 'quasar';
import ptBR from 'quasar/lang/pt-BR';
import 'quasar/src/css/index.sass';

import { App } from 'vue';

export function setup(app: App) {
	app.use(Quasar, {
		lang: ptBR,
		plugins: { Notify, Dialog },
		config: {
			brand: {},
			animations: ['fadeIn', 'fadeOut'],
		},
	});
}

const setDefault = (component: ComponentConstructor<any>, key: string, value: any) => {
	const prop = component.props[key];
	switch (typeof prop) {
		case 'object':
			prop.default = value;
			break;
		case 'function':
			component.props[key] = {
				type: prop,
				default: value,
			};
			break;
		case 'undefined':
			throw new Error('unknown prop: ' + key);
		default:
			throw new Error('unhandled type: ' + typeof prop);
	}
};

setDefault(QField, 'outlined', true);
setDefault(QField, 'hideBottomSpace', true);
setDefault(QField, 'lazyRules', true);

setDefault(QInput, 'outlined', true);
setDefault(QInput, 'hideBottomSpace', true);
setDefault(QInput, 'lazyRules', true);

setDefault(QSelect, 'outlined', true);
setDefault(QSelect, 'hideBottomSpace', true);

setDefault(QBtn, 'noCaps', true);
setDefault(QBtn, 'flat', true);

setDefault(QRouteTab, 'noCaps', true);

setDefault(QBtnDropdown, 'noCaps', true);
setDefault(QBtnDropdown, 'flat', true);

setDefault(QImg, 'noTransition', true);
setDefault(QImg, 'noSpinner', true);

setDefault(QTable, 'flat', true);
setDefault(QTable, 'bordered', true);

setDefault(QInnerLoading, 'color', 'primary');

setDefault(QCard, 'flat', true);
setDefault(QCard, 'bordered', true);
