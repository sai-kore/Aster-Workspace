const text = (t, marks) => (marks ? { type: 'text', text: t, marks } : { type: 'text', text: t })
const bold = [{ type: 'bold' }]
const code = [{ type: 'code' }]

export const welcomePage = {
  title: 'Getting Started',
  icon: '👋',
  content: {
    type: 'doc',
    content: [
      { type: 'heading', attrs: { level: 1 }, content: [text('Welcome to your workspace')] },
      { type: 'paragraph', content: [text('This is your personal space to write notes, plan projects and organise ideas. Everything is saved automatically as you type.')] },
      { type: 'paragraph', content: [text('Press the '), text('/', code), text(' key on an empty line to open the block menu — try it below!')] },
      { type: 'horizontalRule' },
      { type: 'heading', attrs: { level: 2 }, content: [text('Getting around')] },
      {
        type: 'bulletList',
        content: [
          { type: 'listItem', content: [{ type: 'paragraph', content: [text('Click the page title at the top to '), text('rename', bold), text(' it')] }] },
          { type: 'listItem', content: [{ type: 'paragraph', content: [text('Click the icon above the title to change the page '), text('emoji', bold)] }] },
          { type: 'listItem', content: [{ type: 'paragraph', content: [text('Use '), text('Search', bold), text(' (⌘/Ctrl + K) to find pages by title or content')] }] },
          { type: 'listItem', content: [{ type: 'paragraph', content: [text('Hover a page in the sidebar and press '), text('+', bold), text(' to create a page '), text('inside', bold), text(' it')] }] },
          { type: 'listItem', content: [{ type: 'paragraph', content: [text('Deleted pages move to the '), text('Trash', bold), text(' and can be restored')] }] },
        ],
      },
      { type: 'heading', attrs: { level: 2 }, content: [text('Rich formatting')] },
      {
        type: 'paragraph',
        content: [
          text('Select any text to show the formatting toolbar: '),
          text('bold', bold),
          text(', '),
          text('italic', [{ type: 'italic' }]),
          text(', '),
          text('underline', [{ type: 'underline' }]),
          text(', '),
          text('strikethrough', [{ type: 'strike' }]),
          text(', '),
          text('inline code', code),
          text(' and '),
          text('highlight', [{ type: 'highlight' }]),
          text('.'),
        ],
      },
      { type: 'blockquote', content: [{ type: 'paragraph', content: [text('Blockquotes are great for callouts and quotes.')] }] },
      { type: 'codeBlock', attrs: { language: null }, content: [text('const workspace = {\n  owner: "you",\n  collaboration: false,\n  ideas: Infinity,\n};')] },
      { type: 'heading', attrs: { level: 2 }, content: [text('Your first to-dos')] },
      {
        type: 'taskList',
        content: [
          { type: 'taskItem', attrs: { checked: true }, content: [{ type: 'paragraph', content: [text('Read this page')] }] },
          { type: 'taskItem', attrs: { checked: false }, content: [{ type: 'paragraph', content: [text('Create your first page from the sidebar')] }] },
          { type: 'taskItem', attrs: { checked: false }, content: [{ type: 'paragraph', content: [text('Try a slash command — type /heading')] }] },
          { type: 'taskItem', attrs: { checked: false }, content: [{ type: 'paragraph', content: [text('Add this page to favorites')] }] },
        ],
      },
      { type: 'paragraph', content: [text('Happy writing!')] },
    ],
  },
}