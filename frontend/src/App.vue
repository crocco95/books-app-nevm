<template>
    <div v-if="isLoaded()">
        <Navbar />
        <router-view/>
    </div>
</template>
<style lang="scss" scoped>
@import url('./assets/style/style.scss');
</style>
<script>
import Navbar from '@/components/Navbar.vue';

import { mapActions, mapGetters } from 'vuex';

export default {

    name: 'MEVN Books App',

    components: {
        Navbar,
    },

    data(){
        return {
            readyFlag: this.isLoaded(),
        };
    },

    methods:{
        ...mapActions(['registerAuthStateChangedListener']),
        ...mapGetters(['isLoaded']),
    },

    async mounted(){
        await this.registerAuthStateChangedListener();
        console.log("Registered auth changed listener");
    }
}
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
</style>
