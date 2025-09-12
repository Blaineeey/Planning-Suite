// Wedding Website Templates
// Each template provides a complete HTML/CSS structure for the wedding website

const templates = {
  elegant: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{seoTitle}}</title>
    <meta name="description" content="{{seoDescription}}">
    <meta name="keywords" content="{{seoKeywords}}">
    <meta property="og:title" content="{{seoTitle}}">
    <meta property="og:description" content="{{seoDescription}}">
    <meta property="og:image" content="{{ogImage}}">
    
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Raleway:wght@300;400;600&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: {{primaryColor}};
            --secondary: {{secondaryColor}};
            --accent: {{accentColor}};
            --font-heading: 'Playfair Display', serif;
            --font-body: 'Raleway', sans-serif;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: var(--font-body);
            line-height: 1.6;
            color: var(--primary);
            background: var(--secondary);
        }
        
        /* Hero Section */
        .hero {
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            background: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('{{heroImage}}') center/cover;
            color: white;
            position: relative;
        }
        
        .hero h1 {
            font-family: var(--font-heading);
            font-size: 4rem;
            margin-bottom: 1rem;
            animation: fadeInUp 1s ease;
        }
        
        .hero .date {
            font-size: 1.5rem;
            font-weight: 300;
            animation: fadeInUp 1s ease 0.3s both;
        }
        
        .scroll-indicator {
            position: absolute;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            animation: bounce 2s infinite;
        }
        
        /* Navigation */
        nav {
            position: fixed;
            top: 0;
            width: 100%;
            background: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 1000;
            transform: translateY(-100%);
            transition: transform 0.3s ease;
        }
        
        nav.visible {
            transform: translateY(0);
        }
        
        nav ul {
            list-style: none;
            display: flex;
            justify-content: center;
            padding: 1.5rem 0;
        }
        
        nav li {
            margin: 0 2rem;
        }
        
        nav a {
            text-decoration: none;
            color: var(--primary);
            font-weight: 500;
            transition: color 0.3s ease;
        }
        
        nav a:hover {
            color: var(--accent);
        }
        
        /* Sections */
        section {
            padding: 5rem 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        section h2 {
            font-family: var(--font-heading);
            font-size: 3rem;
            text-align: center;
            margin-bottom: 3rem;
            color: var(--primary);
        }
        
        /* Story Section */
        .story {
            background: white;
        }
        
        .story-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
            align-items: center;
        }
        
        .story-text {
            padding: 2rem;
        }
        
        .story-image {
            height: 400px;
            background: url('{{storyImage}}') center/cover;
            border-radius: 10px;
        }
        
        /* Schedule */
        .schedule {
            background: var(--secondary);
        }
        
        .timeline {
            position: relative;
            padding: 2rem 0;
        }
        
        .timeline::before {
            content: '';
            position: absolute;
            left: 50%;
            top: 0;
            bottom: 0;
            width: 2px;
            background: var(--accent);
        }
        
        .timeline-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 3rem;
            position: relative;
        }
        
        .timeline-item::before {
            content: '';
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 20px;
            height: 20px;
            background: var(--accent);
            border-radius: 50%;
            border: 4px solid white;
        }
        
        .timeline-left,
        .timeline-right {
            width: 45%;
            padding: 1.5rem;
            background: white;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        }
        
        .timeline-left {
            text-align: right;
        }
        
        /* RSVP Section */
        .rsvp {
            background: white;
            text-align: center;
        }
        
        .rsvp-form {
            max-width: 600px;
            margin: 0 auto;
        }
        
        .form-group {
            margin-bottom: 1.5rem;
            text-align: left;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
        }
        
        .form-group input,
        .form-group select,
        .form-group textarea {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid #e0e0e0;
            border-radius: 5px;
            font-family: var(--font-body);
            transition: border-color 0.3s ease;
        }
        
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: var(--accent);
        }
        
        .btn {
            background: var(--accent);
            color: white;
            padding: 1rem 3rem;
            border: none;
            border-radius: 50px;
            font-size: 1.1rem;
            font-weight: 500;
            cursor: pointer;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        
        /* Animations */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
                transform: translateY(0) translateX(-50%);
            }
            40% {
                transform: translateY(-20px) translateX(-50%);
            }
            60% {
                transform: translateY(-10px) translateX(-50%);
            }
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .hero h1 {
                font-size: 2.5rem;
            }
            
            .story-content {
                grid-template-columns: 1fr;
            }
            
            .timeline::before {
                left: 30px;
            }
            
            .timeline-item {
                flex-direction: column;
                align-items: flex-start;
                padding-left: 60px;
            }
            
            .timeline-item::before {
                left: 30px;
            }
            
            .timeline-left,
            .timeline-right {
                width: 100%;
                text-align: left;
            }
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav id="navbar">
        <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#story">Our Story</a></li>
            <li><a href="#schedule">Schedule</a></li>
            <li><a href="#venue">Venue</a></li>
            <li><a href="#rsvp">RSVP</a></li>
            <li><a href="#registry">Registry</a></li>
        </ul>
    </nav>

    <!-- Hero Section -->
    <section class="hero" id="home">
        <div class="hero-content">
            <h1>{{heroTitle}}</h1>
            <p class="date">{{heroSubtitle}}</p>
        </div>
        <div class="scroll-indicator">↓</div>
    </section>

    <!-- Our Story -->
    <section class="story" id="story">
        <h2>{{storyTitle}}</h2>
        <div class="story-content">
            <div class="story-text">
                <p>{{storyContent}}</p>
            </div>
            <div class="story-image"></div>
        </div>
    </section>

    <!-- Schedule -->
    <section class="schedule" id="schedule">
        <h2>Wedding Day Schedule</h2>
        <div class="timeline">
            {{#each events}}
            <div class="timeline-item">
                {{#if @even}}
                <div class="timeline-left">
                    <h3>{{title}}</h3>
                    <p class="time">{{time}}</p>
                    <p>{{description}}</p>
                </div>
                <div class="timeline-right" style="visibility: hidden;"></div>
                {{else}}
                <div class="timeline-left" style="visibility: hidden;"></div>
                <div class="timeline-right">
                    <h3>{{title}}</h3>
                    <p class="time">{{time}}</p>
                    <p>{{description}}</p>
                </div>
                {{/if}}
            </div>
            {{/each}}
        </div>
    </section>

    <!-- RSVP -->
    <section class="rsvp" id="rsvp">
        <h2>RSVP</h2>
        <p>Please let us know if you can join us</p>
        <form class="rsvp-form" id="rsvpForm">
            <div class="form-group">
                <label>Full Name *</label>
                <input type="text" name="fullName" required>
            </div>
            <div class="form-group">
                <label>Email *</label>
                <input type="email" name="email" required>
            </div>
            <div class="form-group">
                <label>Will you attend? *</label>
                <select name="attending" required>
                    <option value="">Select...</option>
                    <option value="yes">Yes, I'll be there!</option>
                    <option value="no">Sorry, can't make it</option>
                </select>
            </div>
            <div class="form-group">
                <label>Number of Guests</label>
                <input type="number" name="guestCount" min="1" max="5" value="1">
            </div>
            <div class="form-group">
                <label>Meal Preference</label>
                <select name="mealPreference">
                    <option value="">Select...</option>
                    <option value="beef">Beef</option>
                    <option value="chicken">Chicken</option>
                    <option value="fish">Fish</option>
                    <option value="vegetarian">Vegetarian</option>
                </select>
            </div>
            <div class="form-group">
                <label>Dietary Restrictions</label>
                <textarea name="dietaryRestrictions" rows="3"></textarea>
            </div>
            <div class="form-group">
                <label>Message for the Couple</label>
                <textarea name="message" rows="4"></textarea>
            </div>
            <button type="submit" class="btn">Submit RSVP</button>
        </form>
    </section>

    <script>
        // Show navigation on scroll
        window.addEventListener('scroll', function() {
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 100) {
                navbar.classList.add('visible');
            } else {
                navbar.classList.remove('visible');
            }
        });

        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // RSVP form submission
        document.getElementById('rsvpForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            try {
                const response = await fetch('/api/websites/{{websiteId}}/rsvp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    alert('Thank you for your RSVP!');
                    this.reset();
                } else {
                    alert('There was an error submitting your RSVP. Please try again.');
                }
            } catch (error) {
                alert('There was an error submitting your RSVP. Please try again.');
            }
        });
    </script>
</body>
</html>
`,

  modern: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{seoTitle}}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        .hero { height: 100vh; display: flex; align-items: center; justify-content: center; background: #000; color: #fff; }
        .hero h1 { font-size: 5rem; font-weight: 900; letter-spacing: -3px; }
    </style>
</head>
<body>
    <div class="hero">
        <h1>{{heroTitle}}</h1>
    </div>
</body>
</html>
`,

  rustic: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{seoTitle}}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Georgia, serif; background: #FAF0E6; }
        .hero { height: 100vh; display: flex; align-items: center; justify-content: center; background: url('wood-texture.jpg'); }
        .hero h1 { font-family: cursive; color: #8B4513; }
    </style>
</head>
<body>
    <div class="hero">
        <h1>{{heroTitle}}</h1>
    </div>
</body>
</html>
`
};

/**
 * Process template with data
 */
function processTemplate(templateName, data) {
  let template = templates[templateName] || templates.elegant;
  
  // Replace all placeholders with actual data
  Object.keys(data).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    template = template.replace(regex, data[key] || '');
  });
  
  return template;
}

module.exports = {
  templates,
  processTemplate
};
