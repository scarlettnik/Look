import { makeAutoObservable } from "mobx";
import CollectionStore from "../src/provider/collectionStore.js";
import CartStore from "../src/provider/cardStore.js";
import CatalogStore from "../src/provider/catalogStore.js";
import Onboarding from "./provider/Onboarding.js";


class AppStore {
    collectionStore = new CollectionStore();
    cartStore = new CartStore();
    catalogStore = new CatalogStore();
    onboarding = new Onboarding()

    constructor() {
        makeAutoObservable(this);
    }
}

const appStore = new AppStore();
export default appStore;