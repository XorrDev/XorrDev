document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});





const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("mobile-menu");

hamburger?.addEventListener("click", () => {
  navMenu?.classList.toggle("hidden");
});



document.addEventListener("DOMContentLoaded", async () => {
    const projectGrid = document.getElementById('project-grid');
    const showMoreBtn = document.getElementById('show-more-btn');
    const githubUser = 'rreactjsx'; // Replace with your GitHub username

    let allRepos = [];
    let displayedRepos = 0;
    const reposPerPage = 6;
    let isLoading = false; // Flag to indicate loading state

    // Fetch public repositories from GitHub
    const fetchGitHubRepos = async () => {
        try {
            isLoading = true;
            showMoreBtn.disabled = true; // Disable button while loading
            const response = await fetch(`https://api.github.com/users/${githubUser}/repos?type=public`);
            allRepos = await response.json();
            displayProjects(); // Initial display of projects
        } catch (error) {
            console.error('Error fetching GitHub repositories:', error);
        } finally {
            isLoading = false;
            showMoreBtn.disabled = false; // Enable button after loading
        }
    };

    // Function to display projects
    const displayProjects = async () => {
        const end = displayedRepos + reposPerPage;
        const reposToShow = allRepos.slice(displayedRepos, end);

        for (const repo of reposToShow) {
          const projectCard = document.createElement("div");
          projectCard.className =
            "bg-surface text-left p-4 sm:p-6 rounded-xl shadow-md hover:shadow-2xl transition duration-300 flex flex-col justify-between border border-greenAccent min-h-[240px]";

          // Title
          const projectTitle = document.createElement("h3");
          projectTitle.textContent = repo.name;
          projectTitle.className =
            "text-white/80 uppercase text-lg sm:text-xl font-bold mb-2";

          // Description
          const projectDescription = document.createElement("p");
          projectDescription.textContent =
            repo.description || "No description available.";
          projectDescription.className =
            "text-faded text-sm sm:text-base flex-grow mb-4 line-clamp-3";

          // Button wrapper (pinned to bottom)
          const buttonWrapper = document.createElement("div");
          buttonWrapper.className = "mt-auto pt-4";

          // View Project Button
          const viewButton = document.createElement("a");
          viewButton.href = repo.html_url;
          viewButton.target = "_blank";
          viewButton.textContent = "View Project";
          viewButton.className =
            "inline-block w-full text-center px-4 py-2 text-sm font-extrabold bg-greenAccent/20 text-white border-4 border-accent/30 rounded-full hover:bg-accent hover:text-black transition duration-300";

          // Append elements
          buttonWrapper.appendChild(viewButton);
          projectCard.appendChild(projectTitle);
          projectCard.appendChild(projectDescription);
          projectCard.appendChild(buttonWrapper);


          buttonWrapper.appendChild(viewButton);

          projectCard.appendChild(projectTitle);
          projectCard.appendChild(projectDescription);
          projectCard.appendChild(buttonWrapper);

          projectGrid.appendChild(projectCard);
        }
          

        displayedRepos += reposPerPage;

        // Update button text based on the number of displayed projects
        if (displayedRepos >= allRepos.length && allRepos.length > 6) {
            showMoreBtn.textContent = "Show Less";
        } else if(displayedRepos < allRepos.length && allRepos.length > 6) {
            showMoreBtn.textContent = "Show More";
        } else {
            showMoreBtn.classList.add("hidden");
        }
    };

    // Event listener for the Show More/Less button
    showMoreBtn.addEventListener('click', () => {
        if (isLoading) return; // Ignore clicks while loading

        // Smoothly scroll the button into view
        setTimeout(() => {
            showMoreBtn.scrollIntoView({
                behavior: 'smooth',
                block: 'center' // Center the button in the viewport
            });
        }, 100); // Adjust delay as needed

        if (showMoreBtn.textContent === "Show Less") {
            // Reset to initial state
            projectGrid.innerHTML = '';
            displayedRepos = 0;
            displayProjects();
        } else {
            displayProjects();
        }
    });

    await fetchGitHubRepos();
});




const header = document.getElementById("main-header");
const logo = document.getElementById("logo-img");
const logoWrapper = document.getElementById("logo-wrapper");
const leftNav = document.getElementById("left-nav");
const rightNav = document.getElementById("right-nav");

// Scroll range for animation (in px)
const scrollStart = 0;
const scrollEnd = 100;

window.addEventListener("scroll", () => {
  if (window.innerWidth < 768) return; // Only on desktop

  const scrollY = window.scrollY;

  // Clamp scroll progress between 0 and 1
  let progress = (scrollY - scrollStart) / (scrollEnd - scrollStart);
  progress = Math.min(Math.max(progress, 0), 1);

  // Interpolate header height: from 10rem (h-40) to 5rem (h-20)
  const headerMinHeight = 5 * 16; // 5rem in px (80px)
  const headerMaxHeight = 10 * 16; // 10rem in px (160px)
  const headerHeight =
    headerMaxHeight - progress * (headerMaxHeight - headerMinHeight);
  header.style.height = headerHeight + "px";

  // Interpolate logo height: from 5rem (80px) to 3rem (48px)
  const logoMaxHeight = 5 * 16;
  const logoMinHeight = 3 * 16;
  const logoHeight = logoMaxHeight - progress * (logoMaxHeight - logoMinHeight);
  logo.style.height = logoHeight + "px";

  // Interpolate logo top: from 50% to ~1rem (16px)
  const logoTopMaxPercent = 50;
  const logoTopMinPx = 16;
  // Calculate intermediate top in px (assuming header height as reference)
  const logoTopPx =
    (logoTopMaxPercent / 100) * headerMaxHeight -
    progress * ((logoTopMaxPercent / 100) * headerMaxHeight - logoTopMinPx);
  logoWrapper.style.top = logoTopPx + "px";

  // Interpolate logo transform Y from -50% to 0%
  const translateY = -50 * (1 - progress);
  logoWrapper.style.transform = `translateX(-50%) translateY(${translateY}%)`;

  // Fade navs out from opacity 1 to 0
  const navOpacity = 1 - progress;
  leftNav.style.opacity = navOpacity;
  rightNav.style.opacity = navOpacity;

  // Toggle pointer-events based on opacity threshold
  const pointerEventsValue = navOpacity > 0.1 ? "auto" : "none";
  leftNav.style.pointerEvents = pointerEventsValue;
  rightNav.style.pointerEvents = pointerEventsValue;
});

