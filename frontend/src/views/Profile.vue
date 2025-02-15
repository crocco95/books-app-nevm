<template>
    <div class="container profile pt-5">
        <span class="h1" v-text='emoji'></span>
        <h1 v-text="profile.name + ' ' + profile.surname"></h1>

        <div class="row">
            <div class="col-md-6 offset-md-3">
                <div class="row">
                    <div class="col-md text-center">
                        Followers: <strong v-text="followers.length"></strong>
                    </div>
                    <div class="col-md text-center">
                        Following: <strong v-text="following.length"></strong>
                    </div>
                    <div class="col-md" v-if="getUser()?.uid === userId">
                        <router-link to="/profile-edit" class="btn btn-sm btn-primary">✏️ Edit profile</router-link>
                    </div>
                    <div class="col-md" v-if="getUser()?.uid !== userId && followButtonVisible && !unfollowButtonVisible">
                        <button class="btn btn-sm btn-primary" @click="followUser">Follow</button>
                    </div>
                    <div class="col-md" v-if="getUser()?.uid !== userId && !followButtonVisible && unfollowButtonVisible">
                        <button class="btn btn-sm btn-danger" @click="unfollowUser">Unfollow</button>
                    </div>

                    <div class="col-md" v-if="!isLogged()">
                        <router-link to="/login" class="btn btn-sm btn-primary">
                            <span v-if="!isLogged()">🔒</span>Follow
                        </router-link>
                    </div>
                </div>
            </div>
        </div>

        <div class="row mt-4">
            <div class="col-md-6 offset-md-3">
                <table class="table table-bordered">
                    <tbody>
                    <tr>
                        <th>Books you are reading</th>
                        <td>
                            <span v-text="readingBooks"></span>
                        </td>
                    </tr>

                    <tr>
                        <th>Books already read</th>
                        <td>
                            <span v-text="readBooks"></span>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="row mt-4">
            <div class="col-md-12 text-center">
                <h1>Activities</h1>
                <h4 class="text-muted">Below you can see all the books you read and are reading now</h4>
            </div>
        </div>

        <UserBookReadList class="my-5" :userId="userId" />

    </div>
</template>

<script>

import axios from 'axios';
import UserBookReadList from '@/components/UserBookReadList';
import {mapGetters} from 'vuex';

export default {
    components: {
        UserBookReadList,
    },

    props: {
        userId: String
    },

    data(){
        return {
            pageTitle: 'Profile | MEVN Books App',
            profile: {},
            readingBooks: 0,
            readBooks: 0,
            followers: 0,
            following: 0,
            followButtonVisible: false,
            unfollowButtonVisible: false,
            emoji: '',
        }
    },

    methods:{

        ...mapGetters(['getUser', 'isLogged']),

        followUser(){

            const loggedUserId = this.getUser()?.uid;

            return axios
                .post(`users/${loggedUserId}/social`,{
                    followingUserId: this.userId
                })
                .then( res => {
                    this.followButtonVisible = false;
                    this.unfollowButtonVisible = true;
                })
                .catch( err => console.error( err ));
        },

        unfollowUser(){

            const loggedUserId = this.getUser()?.uid;

            return axios
                .delete(`users/${loggedUserId}/social/${this.userId}`)
                .then( res => {
                    this.followButtonVisible = true;
                    this.unfollowButtonVisible = true;
                    this.followers -= 1;
                })
                .catch(err => console.error(err));
        },

        listSocialRelationships(){

            return axios
                .get(`users/${this.userId}/social`)
                .then( res => {
                    this.following = res.data.following;
                    this.followers = res.data.followers;
                })
                .catch( err => console.error(err));
        },

        checkFollow(){

            const loggedUserId = this.getUser()?.uid;

            return axios
                .get(`users/${loggedUserId}/social/${this.userId}`)
                .then( res => {
                    console.log(res.data);
                    this.followButtonVisible = res.data === null;
                    this.unfollowButtonVisible = !this.followButtonVisible;
                })
                .catch(err => console.error(err));
        },

        fetchUserDetails(){

            return axios
                .get(`profiles/${this.userId}`)
                .then( res => this.profile = res.data )
                .catch( err => console.error(err));
        },

        fetchUserBooks(){

            axios
                .get(`books/read/search?userId=${this.userId}`)
                .then( res => {
                    res.data.forEach( b => {

                        if( b.finishDate ){
                            this.readBooks += 1;
                        }else{
                            this.readingBooks += 1;
                        }
                    })
                })
                .catch( err => console.error(err.response.data));
        }
    },

    mounted(){

        // Set page meta title
        document.title = this.pageTitle;

        this.checkFollow();

        this.fetchUserDetails()
        .then( details => {
            switch (details.genre){
                case 'male':
                    this.emoji = '👨';
                    break;
                case 'female':
                    this.emoji = '👩';
                    break;
                default:
                    this.emoji = '🧑';
                    break;

            }
        });

        this.fetchUserBooks();
        this.listSocialRelationships();
    },
}
</script>

<style>
.main-picture {
    display: block;
    margin: 0 auto;
    width: 100px;
    height: 100px;

    border-radius: 10rem 10rem 0;
}

table tr:first {
    border-radius: 1rem;
}

table th {
    text-align: left;
}
</style>