import { makeAutoObservable } from 'mobx';
import {AUTH_TOKEN} from "../constants.js";

class CollectionStore {
    currentCollection = null;
    loading = false;
    error = null;

    constructor() {
        makeAutoObservable(this);
    }

    async loadCollection(collectionId, isSave = false) {
        this.loading = true;
        this.error = null;

        try {
            const response = await fetch(`https://api.lookvogue.ru/v1/collection/${collectionId}`, {
                method: 'GET',
                headers: {
                    "ngrok-skip-browser-warning": true,
                    "Content-Type": "application/json",
                    Authorization: `tma ${AUTH_TOKEN}`,
                },
            });
            const data = await response.json();
            console.log(data)
            this.currentCollection = data;
        } catch (error) {
            this.error = error.message;
        } finally {
            this.loading = false;
        }
    }
}

export default CollectionStore;