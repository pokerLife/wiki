module.exports = {
  title: 'Aluoli 中文文档',
  description: '🛠️ Aluoli管理系统快速开发框架 中文文档',
  port: 8080,
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
  markdown: {
    lineNumbers: true
  },
  plugins: ['vuepress-plugin-nprogress'],
  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/' },
      { text: '组件', link: '/core/' },
      { text: '帮助', link: '/help/' },
      { text: 'GitHub', link: 'https://google.com' },
    ], sidebar: [
      {
        title: 'Group 1',   // 必要的
        path: '/foo/',      // 可选的, 应该是一个绝对路径
        collapsable: false, // 可选的, 默认值是 true,
        sidebarDepth: 1,    // 可选的, 默认值是 1
        children: [
          '/'
        ]
      },
      {
        title: 'Group 2',
        children: [ /* ... */ ]
      }
    ]
  }
}
