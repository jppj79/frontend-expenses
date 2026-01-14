<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 dark:from-gray-950 dark:via-blue-950 dark:to-emerald-950">
    <!-- Hero Section -->
    <section class="relative overflow-hidden">
      <!-- Animated Background Elements -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute bottom-20 right-10 w-96 h-96 bg-emerald-400/20 dark:bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <!-- Navigation -->
      <nav class="relative z-10 container mx-auto px-6 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
              E
            </div>
            <span class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
              ExpenseTracker
            </span>
          </div>
          <div class="flex items-center gap-4">
            <UButton 
              to="/expenses" 
              label="Get Started" 
              color="primary"
              size="lg"
              class="bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white border-none shadow-lg hover:shadow-xl transition-all duration-300"
            />
          </div>
        </div>
      </nav>

      <!-- Hero Content -->
      <div class="relative z-10 container mx-auto px-6 py-20 lg:py-32">
        <div class="max-w-4xl mx-auto text-center">
          <!-- Badge -->
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-sm mb-8">
            <UIcon name="i-heroicons-sparkles" class="w-4 h-4 text-emerald-500" />
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Smart Financial Management</span>
          </div>

          <!-- Main Heading -->
          <h1 class="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Track Your Expenses
            <span class="block bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
              Effortlessly
            </span>
          </h1>

          <!-- Subtitle -->
          <p class="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Take control of your finances with powerful analytics, intuitive tracking, and beautiful visualizations.
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <UButton 
              to="/expenses" 
              label="Start Tracking" 
              icon="i-heroicons-rocket-launch"
              size="xl"
              class="bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white border-none shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            />
            <UButton 
              to="/expenses/stats" 
              label="View Analytics" 
              icon="i-heroicons-chart-bar"
              size="xl"
              color="white"
              class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300"
            />
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto">
            <div class="text-center">
              <div class="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">100%</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Free to Use</div>
            </div>
            <div class="text-center">
              <div class="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">Real-time</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Analytics</div>
            </div>
            <div class="text-center">
              <div class="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">Secure</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Data Storage</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="relative z-10 py-20 lg:py-32">
      <div class="container mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need
          </h2>
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Powerful features designed to make expense tracking simple and effective
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <!-- Feature 1 -->
          <div class="group relative">
            <div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-emerald-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <div class="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 shadow-lg">
                <UIcon name="i-heroicons-document-text" class="w-7 h-7 text-white" />
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Easy Tracking</h3>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                Add, edit, and manage your expenses with an intuitive interface designed for speed and simplicity.
              </p>
            </div>
          </div>

          <!-- Feature 2 -->
          <div class="group relative">
            <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <div class="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-6 shadow-lg">
                <UIcon name="i-heroicons-chart-pie" class="w-7 h-7 text-white" />
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Visual Analytics</h3>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                Beautiful charts and graphs help you understand your spending patterns at a glance.
              </p>
            </div>
          </div>

          <!-- Feature 3 -->
          <div class="group relative">
            <div class="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <div class="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg">
                <UIcon name="i-heroicons-funnel" class="w-7 h-7 text-white" />
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Smart Filtering</h3>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                Search and filter your expenses by category, date, or amount to find exactly what you need.
              </p>
            </div>
          </div>

          <!-- Feature 4 -->
          <div class="group relative">
            <div class="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <div class="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-6 shadow-lg">
                <UIcon name="i-heroicons-tag" class="w-7 h-7 text-white" />
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Categories</h3>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                Organize expenses into customizable categories for better insights into your spending habits.
              </p>
            </div>
          </div>

          <!-- Feature 5 -->
          <div class="group relative">
            <div class="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-pink-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <div class="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center mb-6 shadow-lg">
                <UIcon name="i-heroicons-moon" class="w-7 h-7 text-white" />
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Dark Mode</h3>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                Switch between light and dark themes for comfortable viewing in any environment.
              </p>
            </div>
          </div>

          <!-- Feature 6 -->
          <div class="group relative">
            <div class="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-teal-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <div class="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center mb-6 shadow-lg">
                <UIcon name="i-heroicons-device-phone-mobile" class="w-7 h-7 text-white" />
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">Responsive Design</h3>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                Access your expenses from any device with a fully responsive, mobile-friendly interface.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="relative z-10 py-20 lg:py-32">
      <div class="container mx-auto px-6">
        <div class="relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-3xl"></div>
          <div class="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] rounded-3xl"></div>
          
          <div class="relative px-8 py-16 lg:px-16 lg:py-24 text-center">
            <h2 class="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Take Control?
            </h2>
            <p class="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Start tracking your expenses today and gain valuable insights into your financial habits.
            </p>
            <UButton 
              to="/expenses" 
              label="Get Started Now" 
              icon="i-heroicons-arrow-right"
              size="xl"
              color="white"
              class="bg-white text-blue-600 hover:bg-gray-50 border-none shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="relative z-10 py-12 border-t border-gray-200 dark:border-gray-800">
      <div class="container mx-auto px-6">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white font-bold shadow-lg">
              E
            </div>
            <span class="text-lg font-bold text-gray-900 dark:text-white">ExpenseTracker</span>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            © 2026 ExpenseTracker. Built with ❤️ using Nuxt & Vue.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false, // Use custom layout for landing page
  ssr: false
})

// SEO Meta tags
useHead({
  title: 'ExpenseTracker - Track Your Expenses Effortlessly',
  meta: [
    { name: 'description', content: 'Take control of your finances with powerful analytics, intuitive tracking, and beautiful visualizations. Start tracking your expenses today.' },
    { property: 'og:title', content: 'ExpenseTracker - Smart Financial Management' },
    { property: 'og:description', content: 'Track your expenses effortlessly with beautiful analytics and intuitive interface.' },
  ]
})
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.8;
  }
}

.animate-pulse {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.delay-1000 {
  animation-delay: 1s;
}

.bg-grid-white\/10 {
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}
</style>
