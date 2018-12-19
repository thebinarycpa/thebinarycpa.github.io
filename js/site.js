// Class represented in the ViewModel
var Entry = function(data) {
    var self = this;
    self.blogEntryId = data.BlogEntryId;
    self.timeStamp = data.TimeStamp;
    self.language = data.Language;
    self.blogText = data.BlogText;
    self.likes = ko.observable(data.Likes);
    self.alreadyLiked = ko.observable(false);
}

// Create the ViewModel
var BlogVm = function() {
    var self = this;
    self.languages = ['C#', 'JavaScript'];
    self.chosenLanguageId = ko.observable();
    self.chosenLanguageData = ko.observableArray([]);

    // Behaviors
    self.goToLanguage = function(language) {
        self.chosenLanguageId(language);
        $.getJSON('https://githubaccountapithebincpa.azurewebsites.net/api/blogentries', {language: language}, function(response) {
            var mappedEntries = $.map(response, function(item) {return new Entry(item)});
            self.chosenLanguageData(mappedEntries);
        });
    };

    self.liked = function(entry) { 
        entry.likes(entry.likes() + 1);
        entry.alreadyLiked(true);
        $.ajax("https://githubaccountapithebincpa.azurewebsites.net/api/blogentries", {
            data: ko.toJSON({BlogEntryId: entry.blogEntryId, TimeStamp: entry.timeStamp, Language: entry.language, BlogText: entry.blogText, Likes: entry.likes()}),
            type: "post", contentType: "application/json",
            success: function(result) { alert('Thanks for liking my post!') }
        });
    };

    self.goToLanguage('C#');
};

ko.applyBindings(new BlogVm());