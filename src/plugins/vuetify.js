import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light:  {
                primary: '#04c800',
                secondary: '#3f51b5',
                accent: '#ffc107',
                error: '#f44336',
                warning: '#ffeb3b',
                info: '#8bc34a',
                success: '#009688'
            }
        }
    }
});
