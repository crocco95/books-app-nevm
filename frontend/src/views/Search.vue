<template>
    <div class="container-fluid" v-if='doneFlag'>
        <div class="row search-bar-container">
            <div class="col-md-8 offset-md-2">
                <h1 class="fw-bolder">Search</h1>
                <SearchTextInput :query='query'/>
            </div>
        </div>


        <div class="row mt-4">
            <div class="col-md-8 offset-md-2">
                <BooksList />
            </div>
        </div>

    </div>
</template>

<script>

import SearchTextInput from '@/components/SearchTextInput.vue'
import BooksList from '@/components/BooksList.vue'

export default {
    components: {
        SearchTextInput,
        BooksList
    },

    data(){
      return {
          pageTitle: 'Search | MEVN Books App',
          doneFlag: false,
          query: '',
      }
    },

    mounted(){

        // Set page meta title
        document.title = this.pageTitle;

        const query = this.$route.query.query;
        if(query){
            this.query = query;
        }

        this.doneFlag = true;
    }
}

</script>

<style scoped>
h1{
    text-align: left;
}

.search-bar-container {
    background-image: url('../assets/bg_search.jpg');
    background-position: center;
    background-size: cover;
    /* background-attachment: fixed; */ /* Great visual impact but not so much usefull here... */

    padding: 20vh 0;
    border-radius: 0 0 1rem 1rem;
}

.tip {
    padding: 10px 20px;
    border-radius: 100rem;
    background-color: rgba(255, 255, 255, .8);
}
</style>