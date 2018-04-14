let entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
    '\n': '<br />'
};

function escapeHtml (string) {
    return String(string).replace(/[&<>"'`=\//\n/]/g, function (s) {
        return entityMap[s];
    });
}
