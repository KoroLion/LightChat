let entityMap = {
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
};

function escapeHtml (string) {
    return String(string).replace(/[<>"']/g, function (s) {
        return entityMap[s];
    });
}
