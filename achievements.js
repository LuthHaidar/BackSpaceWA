// Array to store the achieved achievements
var achievedAchievements = [];

// Achievements
var achievements = [
  {
    name: "Novice Deleter",
    description: "Delete 1,000 characters",
    target: 1000,
    achieved: false,
  },
  {
    name: "Master Deleter",
    description: "Delete 10,000 characters",
    target: 10000,
    achieved: false,
  },
  {
    name: "Swift Typist",
    description: "Reach 5 auto-clicks per second",
    target: 5,
    achieved: false,
  },
  // Add more achievements as needed
];

// Function to check and update achievements
function checkAchievements() {
  for (let i = 0; i < achievements.length; i++) {
    let achievement = achievements[i];
    if (!achievement.achieved && deletedChars >= achievement.target) {
      achievement.achieved = true;
      achievedAchievements.push(achievement);
      showAchievement(achievement);
    }
  }
}

// Function to display an achieved achievement
function showAchievement(achievement) {
    confettiEffect();
    // Create a toast element
    var toast = document.createElement("div");
    toast.className = "toast";
    
    // Create a title element for the achievement name
    var title = document.createElement("h3");
    title.innerText = achievement.name;
    
    // Create a description element for the achievement description
    var description = document.createElement("p");
    description.innerText = achievement.description;
    
    // Append the title and description to the toast element
    toast.appendChild(title);
    toast.appendChild(description);
    
    // Append the toast element to the document body
    document.body.appendChild(toast);
    
    // After a delay, remove the toast element
    setTimeout(function() {
      toast.remove();
    }, 3000); // Adjust the delay (in milliseconds) as needed
}
