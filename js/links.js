const linkCategories = {
    tools: [
        { name: "ChatGPT", url: "https://chatgpt.com/" },
        { name: "Deepseek", url: "https://chat.deepseek.com/" },
        { name: "Google Drive", url: "https://drive.google.com" },
        { name: "Gmail", url: "https://mail.google.com" },
        { name: "Wikipedia", url: "https://www.wikipedia.org" },
        { name: "Google Translate", url: "https://translate.google.com/" },
        { name: "Arch Linux", url: "https://archlinux.org/" },
    ],
    social: [
        { name: "Twitter", url: "https://www.twitter.com/" },
        { name: "Reddit", url: "https://www.reddit.com" },
        { name: "Discord", url: "https://discord.com" },
        { name: "Telegram", url: "https://telegram.org/" },
        { name: "Github", url: "https://github.com" },
    ],
    content: [
        { name: "Spotify", url: "https://spotify.com" },
        { name: "Twitch", url: "https://www.twitch.tv" },
        { name: "Wallhaven", url: "https://wallhaven.cc" },
        { name: "YouTube Music", url: "https://music.youtube.com" },
        { name: "YouTube", url: "https://www.youtube.com" },
        { name: "Soundcloud", url: "https://soundcloud.com/" },
        { name: "Pinterest", url: "https://www.pinterest.com/" },
        { name: "TikTok", url: "https://www.tiktok.com/en/" },
    ]
};

function createLinks() {
    const toolsContainer = document.getElementById('tools-links');
    linkCategories.tools.forEach(link => {
        const linkElement = document.createElement('a');
        linkElement.href = link.url;
        linkElement.className = 'btn';
        linkElement.textContent = link.name;
        linkElement.target = '_blank';
        toolsContainer.appendChild(linkElement);
    });
    
    const socialContainer = document.getElementById('social-links');
    linkCategories.social.forEach(link => {
        const linkElement = document.createElement('a');
        linkElement.href = link.url;
        linkElement.className = 'btn';
        linkElement.textContent = link.name;
        linkElement.target = '_blank';
        socialContainer.appendChild(linkElement);
    });
    
    const contentContainer = document.getElementById('content-links');
    linkCategories.content.forEach(link => {
        const linkElement = document.createElement('a');
        linkElement.href = link.url;
        linkElement.className = 'btn';
        linkElement.textContent = link.name;
        linkElement.target = '_blank';
        contentContainer.appendChild(linkElement);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    createLinks();
});