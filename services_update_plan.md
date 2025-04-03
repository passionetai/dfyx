# Plan: Update Services Section in index.html

**Objective:**

Replace the current Services section (lines 89-195 in `index.html`) with a new layout using the 6 services provided in the JSON data. The new layout will feature:
*   Emojis as icons.
*   A simple, centered card style with borders (similar to the image).
*   Fade-up animations on scroll for the cards.

**Plan Details:**

1.  **Identify Target:** The HTML block from line 89 (`<section id="services" ...>`) to line 195 (`</div>`) will be replaced.
2.  **Generate New HTML:**
    *   Keep the main section tag and container div.
    *   Retain the current section title (`Our Premium Tech Services`) and description, including its `data-aos="fade-up"` animation.
    *   Create a `div` with Tailwind classes `grid grid-cols-1 md:grid-cols-3 gap-6` to hold the service cards.
    *   For each of the 6 services in the `services_preview` JSON array:
        *   Create a card `div` with classes: `bg-white p-6 rounded-lg border border-gray-200 text-center transition hover:shadow-md`.
        *   Add `data-aos="fade-up"` and a staggered `data-aos-delay` (100ms, 200ms, 300ms, repeating for the second row).
        *   Inside the card:
            *   A `div` for the emoji icon with class `text-4xl mb-4`.
            *   An `h3` for the title with classes `text-xl font-semibold text-gray-900 mb-2`.
            *   A `p` for the description with classes `text-gray-600 text-sm`.
3.  **Implementation:** Use the `apply_diff` tool in Code mode to replace the old HTML block (lines 89-195) with the newly generated HTML.

**Proposed HTML Structure (Example):**

```html
<!-- Services Section -->
<section id="services" class="py-20">
    <div class="container mx-auto px-6">
        <div class="text-center max-w-2xl mx-auto mb-16" data-aos="fade-up">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Premium Tech Services</h2>
            <p class="text-gray-600 text-lg">
                Comprehensive solutions designed to meet your business needs with precision and efficiency
            </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Service Card 1: Software Installation -->
            <div class="bg-white p-6 rounded-lg border border-gray-200 text-center transition hover:shadow-md" data-aos="fade-up" data-aos-delay="100">
                <div class="text-4xl mb-4">🖥️</div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Software Installation</h3>
                <p class="text-gray-600 text-sm">Fast, secure installation for all your systems.</p>
            </div>

            <!-- Service Card 2: Web3 / Blockchain -->
            <div class="bg-white p-6 rounded-lg border border-gray-200 text-center transition hover:shadow-md" data-aos="fade-up" data-aos-delay="200">
                <div class="text-4xl mb-4">⛓️</div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Web3 / Blockchain</h3>
                <p class="text-gray-600 text-sm">DApp development, smart contracts & more.</p>
            </div>

            <!-- Service Card 3: E-commerce / E-learning -->
            <div class="bg-white p-6 rounded-lg border border-gray-200 text-center transition hover:shadow-md" data-aos="fade-up" data-aos-delay="300">
                <div class="text-4xl mb-4">🛒</div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">E-commerce / E-learning</h3>
                <p class="text-gray-600 text-sm">Custom platforms for selling and learning online.</p>
            </div>

            <!-- Service Card 4: AI Chatbots -->
            <div class="bg-white p-6 rounded-lg border border-gray-200 text-center transition hover:shadow-md" data-aos="fade-up" data-aos-delay="100">
                <div class="text-4xl mb-4">🤖</div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">AI Chatbots</h3>
                <p class="text-gray-600 text-sm">Automate customer interaction with smart AI.</p>
            </div>

            <!-- Service Card 5: Data Recovery -->
            <div class="bg-white p-6 rounded-lg border border-gray-200 text-center transition hover:shadow-md" data-aos="fade-up" data-aos-delay="200">
                <div class="text-4xl mb-4">💾</div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Data Recovery</h3>
                <p class="text-gray-600 text-sm">Recover lost files from drives and devices.</p>
            </div>

            <!-- Service Card 6: Repairs & Networking -->
            <div class="bg-white p-6 rounded-lg border border-gray-200 text-center transition hover:shadow-md" data-aos="fade-up" data-aos-delay="300">
                <div class="text-4xl mb-4">🛠️</div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Repairs & Networking</h3>
                <p class="text-gray-600 text-sm">Phone, PC, laptop repairs & network setup.</p>
            </div>
        </div>
    </div>
</section>