// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require_tree .

$.FollowToggle = function (el) {
  this.$el = $(el);
  this.userId = this.$el.data('user-id');
  this.followState = this.$el.data("initial-follow-state")
  this.render();
  this.bindClickEvent();
};

$.FollowToggle.prototype.render = function () {
  if (this.followState == "unfollowing" || this.followState == "following") {
    this.$el.prop( "disabled", true );
  } else {
    this.$el.prop( "disabled", false );
  }
  if (this.followState == "unfollowed") {
    this.$el.html("Follow!");
  } else {
    this.$el.html("Unfollow!");
  }
};

$.FollowToggle.prototype.handleClick = function (event){
  var that = this;
  if (this.followState == "unfollowed") {
    this.followState = "following";
    this.render();
    $.ajax({
      url: "/users/" + this.userId + "/follow/",
      type: 'POST',
      success: function() { 
        that.followState = "followed";
        that.render();
      } 
    });
    
  } else {
    this.followState = "following";
    this.render();
    $.ajax({
      url: "/users/" + this.userId + "/follow/",
      type: 'DELETE',
      dataType: 'json',
      success: function() {
        that.followState = "unfollowed";
        that.render();
      }
    });
  }
  
}

$.FollowToggle.prototype.bindClickEvent = function () {
  var that = this;
  this.$el.on("click", function(event){
    event.preventDefault();
    that.handleClick(event);
  });
}

$.fn.followToggle = function () {
  return this.each(function () {
    new $.FollowToggle(this);
  });
};

$(function () {
  $("button.follow-toggle").followToggle();
});




$.UsersSearch = function (el) {
  this.$el = $(el);
  //this.render();
  this.bindInputEvent();
};

$.UsersSearch.prototype.handleInput = function (event) {
  var that = this;
  $.ajax({
    url: "/users/search",
    type: 'GET',
    data: { "query": event.currentTarget.value },
    dataType: 'json',
    success: function(data) { 
      that.renderResults(data);
    }
  });
};

$.UsersSearch.prototype.renderResults = function (data) {
  $ul = $("ul.users").empty();
  data.forEach(function(user){
    var $li = $("<a href='/users/" + user.id + "'>" + user.username + "</a>");
    var fol = ""
    if (user.followed){
      fol ="followed";
    } else {
      fol = "unfollowed";
    }
    var $button = $('<button type="button" data-user-id="' + user.id + '" data-initial-follow-state="' + fol + '" class="follow-toggle"></button><br>')
      $button.followToggle()
    $ul.append($li, $button);
  })
}

$.UsersSearch.prototype.bindInputEvent = function () {
  var that = this;
  this.$el.on("keyup", "input", function(event){
    event.preventDefault();
    that.handleInput(event);
  });
}

$.fn.usersSearch = function () {
  return this.each(function () {
    new $.UsersSearch(this);
  });
};

$(function () {
  $(".users-search").usersSearch();
});






