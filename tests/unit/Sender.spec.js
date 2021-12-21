import Sender from "@/components/Sender";
import Vuetify from "vuetify";
import {createLocalVue, mount} from '@vue/test-utils'

describe('SenderField', () => {

    const localVue = createLocalVue()
    let vuetify

    beforeEach(() => {
        vuetify = new Vuetify()
    });

    test('Sendername as single line', () => {
        const wrapper = mount(Sender)
        expect(wrapper.find("#sender").text()).toBe("Samuel Mathes - Brucknerstr. 28 - 72766 Reutlingen")
    });
});