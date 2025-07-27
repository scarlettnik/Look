import { makeAutoObservable } from "mobx";
import AuthStore from "./provider/AuthStore";
import CollectionStore from "./provider/collectionStore";
import CartStore from "./provider/cardStore";
import CatalogStore from "./provider/catalogStore";
import Onboarding from "./provider/Onboarding";
import PopularStore from "./provider/PopularStore";

class AppStore {
    authStore = new AuthStore();
    collectionStore = new CollectionStore();
    cartStore = new CartStore();
    catalogStore = new CatalogStore();
    onboarding = new Onboarding();
    popular = new PopularStore();

    constructor() {
        makeAutoObservable(this);
    }
}

const appStore = new AppStore();
export default appStore;
