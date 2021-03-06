﻿let pages = [];
$(document).ready(function () {
    let dropdownList = $('#pages .dropdown-menu');
    let selected = $('#pagesSelected');
    let selectPostButton = $('#selectPost,#postLink');
    window.fbAsyncInit = function () {
        FB.init({
            appId: '253756692014883',
            cookie: true,
            xfbml: true,
            version: 'v3.1'
        });

        FB.AppEvents.logPageView();
        let accessToken;
        FB.getLoginStatus(function (response) {
            if (response.status === 'connected') {
                accessToken = response.authResponse.accessToken;
                FB.api(
                    '/me',
                    'GET',
                    { 'access_token': accessToken },
                    function (response) {
                        $.ajax({
                            url: "SaveAccessTokenAsync",
                            method: "POST",
                            data: {
                                accessToken: accessToken,
                                name: response.name
                            },
                            success: function (response) {
                                console.log(response);
                                FB.api(
                                    '/me/accounts',
                                    'GET',
                                    { 'access_token': accessToken },
                                    function (innerResponse) {
                                        $.each(innerResponse.data, function (index, value) {
                                            pages.push(value);
                                            let listItem = `<a class="dropdown-item pages" href="#" data-value="` + index + `">` + value.name + `</a>`;
                                            dropdownList.append(listItem);
                                        });
                                        let pointsDropdownItem = $('#points .dropdown-item');
                                        let pagesDropdownItem = $('#pages .dropdown-item');
                                        let pageId = $('#page_id').val();


                                        let page_id = $('#page_id');
                                        let page_link = $('#page_link');
                                        let page_access_token = $('#page_access_token');
                                        let post_points = $('#post_points');
                                        pagesDropdownItem.click(function () {
                                            let index = $(this).attr('data-value');
                                            selected.val(index);
                                            selected.text($(this).text());
                                            page_id.val(pages[index].id);
                                            page_link.val("https://facebook.com/" + pages[index].id);
                                            page_access_token.val(pages[index].access_token);
                                            FB.api(
                                                '/' + pages[index].id + '/posts',
                                                'GET',
                                                {
                                                    'access_token': pages[index].access_token
                                                },
                                                function (response) {
                                                    console.log(response);
                                                    let posts = $('#posts div .row');
                                                    posts.empty();
                                                    $.each(response.data, function (indexPost, value) {
                                                        let link = "https://www.facebook.com/";
                                                        let idOfPage = pages[index].id;
                                                        let idOfPost = value.id.substr(value.id.lastIndexOf('_') + 1);
                                                        link = link + idOfPage + '/posts/' + idOfPost;
                                                        setContent(link, posts);
                                                    });
                                                    FB.XFBML.parse();
                                                }
                                            );
                                            selectPostButton.removeAttr('disabled');
                                        });
                                        pointsDropdownItem.click(function () {
                                            let index = $(this).attr('data-value');
                                            let selected = $(this).parent('.dropdown-menu').siblings('.btn');
                                            post_points.val($(this).text());
                    
                                            selected.val(index);
                                            selected.text($(this).text());
                                        });

                                        if (pageId) {
                                            let pageIndex = pages.findIndex((value) => value.id === pageId);
                                            let itemToSelect = $(pagesDropdownItem.get(pageIndex));
                                            itemToSelect.trigger('click');
                                        }
                                    });
                            }
                        });
                    }

                );
            }
        });

        function setContent(link, posts) {
            let post = `<label class="btn btn-light col-md-12 mw-100 justify-content-center d-flex p-0">
                    <div class="row mw-100 justify-content-center d-flex p-0">
                   <input type="radio" class="col-md-12" name="postLinks" autocomplete="off" value="`+ link + `">
            <div class="col-md-12 justify-content-center d-flex p-0 p-md-2" style="padding-top:2%">
            <div class="fb-post" data-href="`+ link + `"
            data-width="350" data-show-text="true">
            <blockquote cite="`+ link + `"
                class="fb-xfbml-parse-ignore"></blockquote>
            </div>
            </div>
            </div>
               </label>
                <hr/>
`;
            posts.append(post);
        }
    };
    let postLink = $('#postLink');
    $('#postsModal').on('hidden.bs.modal', function (e) {
        let link = $('input[name=postLinks]:checked').val();
        postLink.val(link);
        postLink.text(link);
    });

    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) { return; }
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

});