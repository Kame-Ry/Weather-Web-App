const postFiles = [
    { file: "plex_watched_movie_link.html", date: "2025-03-16"},
    { file: "weather_tracker_link.html", date: "2025-03-15"},
    { file: "film_affinity_link.html", date: "2025-03-14"},
    { file: "contact_form_project_link.html", date: "2025-03-14"},
    { file: "quotes_project_link.html", date: "2025-03-13"},
    { file: "seaglass_project_link.html", date: "2025-03-10"},
    { file: "tags_article_link.html", date: "2025-03-10"},
];

postFiles.sort((a, b) => new Date(b.date) - new Date(a.date));

console.log("Final sorted postFiles:", postFiles);

export default postFiles;
