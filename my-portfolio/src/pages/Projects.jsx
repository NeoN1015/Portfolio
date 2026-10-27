import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { PROJECTS } from '../data/projects'
import './Projects.css'

const PROJECTS_KEY = 'neon-portfolio-projects-v1'
const VOTES_KEY = 'neon-portfolio-votes-v1'
const COMMENTS_KEY = 'neon-portfolio-comments-v1'

const profanity = new Set([
  'ass',
  'asshole',
  'bastard',
  'bitch',
  'bullshit',
  'damn',
  'fuck',
  'fucking',
  'shit',
  'shitty',
])

function readStorage(key, fallback) {
  try {
    const stored = window.localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch {
    return fallback
  }
}

function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

function canUseStorage() {
  try {
    const testKey = `${PROJECTS_KEY}-test`
    window.localStorage.setItem(testKey, '1')
    window.localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

function readVotes() {
  const stored = readStorage(VOTES_KEY, {})
  if (!stored || typeof stored !== 'object' || Array.isArray(stored)) return {}
  return Object.fromEntries(
    Object.entries(stored).filter(([, vote]) => vote === 'like' || vote === 'dislike'),
  )
}

function readComments() {
  const stored = readStorage(COMMENTS_KEY, {})
  if (!stored || typeof stored !== 'object' || Array.isArray(stored)) return {}
  return Object.fromEntries(
    Object.entries(stored).filter(
      ([, entries]) =>
        Array.isArray(entries) &&
        entries.every(
          (entry) =>
            entry &&
            typeof entry.id === 'string' &&
            typeof entry.name === 'string' &&
            typeof entry.text === 'string' &&
            typeof entry.date === 'string',
        ),
    ),
  )
}

function moderate(name, text) {
  const cleanName = name.trim()
  const cleanText = text.trim()
  if (cleanName.length < 2 || cleanName.length > 40) {
    return { valid: false, field: 'name', message: 'Name must be 2–40 characters.' }
  }
  if (cleanText.length < 3 || cleanText.length > 500) {
    return { valid: false, field: 'text', message: 'Comment must be 3–500 characters.' }
  }
  const linkPattern =
    /(?:https?:\/\/|www\.|(?:^|\b)(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/[^\s]*)?)/i
  if (linkPattern.test(`${cleanName} ${cleanText}`)) {
    return { valid: false, field: 'text', message: 'Links and domain names are not allowed.' }
  }

  const normalized = `${cleanName} ${cleanText}`
    .toLowerCase()
    .replace(/[0134578@$!]/g, (character) => ({
      '0': 'o',
      '1': 'i',
      '3': 'e',
      '4': 'a',
      '5': 's',
      '7': 't',
      '8': 'b',
      '@': 'a',
      $: 's',
      '!': 'i',
    })[character])
    .replace(/([a-z])\1+/g, '$1')
  const words = normalized.match(/[a-z]+/g) || []
  if (words.some((word) => profanity.has(word))) {
    return { valid: false, field: 'text', message: 'Please keep comments respectful.' }
  }
  return { valid: true, name: cleanName, text: cleanText }
}

function isProject(value) {
  return (
    value &&
    typeof value.id === 'string' &&
    /^[a-z0-9][a-z0-9-]*$/i.test(value.id) &&
    ['software', 'hardware'].includes(value.type) &&
    typeof value.title === 'string' &&
    value.title.trim().length > 0 &&
    value.title.length <= 100 &&
    typeof value.date === 'string' &&
    Number.isFinite(new Date(value.date).getTime()) &&
    typeof value.description === 'string' &&
    value.description.trim().length > 0 &&
    value.description.length <= 1000 &&
    Array.isArray(value.nodes) &&
    Number.isInteger(value.likes) &&
    value.likes >= 0 &&
    Number.isInteger(value.dislikes) &&
    value.dislikes >= 0 &&
    value.nodes.every(
      (node) =>
        node &&
        typeof node.id === 'string' &&
        node.id.length > 0 &&
        typeof node.label === 'string' &&
        node.label.length > 0 &&
        typeof node.kind === 'string',
    ) &&
    (value.type === 'software'
      ? typeof value.url === 'string' &&
        (!value.url || /^https?:\/\/\S+$/i.test(value.url))
      : typeof value.code === 'string')
  )
}

function isProjectList(value) {
  return (
    Array.isArray(value) &&
    value.every(isProject) &&
    new Set(value.map((project) => project.id)).size === value.length
  )
}

function useProjects() {
  const [projects, setProjects] = useState(() => {
    const stored = readStorage(PROJECTS_KEY, null)
    return isProjectList(stored) ? stored : PROJECTS
  })
  const [storageAvailable, setStorageAvailable] = useState(canUseStorage)
  const updateProjects = useCallback((nextProjects) => {
    const next = typeof nextProjects === 'function' ? nextProjects(projects) : nextProjects
    setProjects(next)
    if (!writeStorage(PROJECTS_KEY, next)) setStorageAvailable(false)
  }, [projects])

  return { projects, updateProjects, storageAvailable }
}

function useVotes() {
  const [votes, setVotes] = useState(readVotes)

  useEffect(() => {
    writeStorage(VOTES_KEY, votes)
  }, [votes])

  const vote = useCallback((id, value) => {
    setVotes((current) => (current[id] ? current : { ...current, [id]: value }))
  }, [])

  const renameVote = useCallback((from, to) => {
    setVotes((current) => {
      if (!current[from]) return current
      const next = { ...current, [to]: current[from] }
      delete next[from]
      return next
    })
  }, [])

  return { votes, vote, renameVote }
}

function useComments() {
  const [comments, setComments] = useState(readComments)

  useEffect(() => {
    writeStorage(COMMENTS_KEY, comments)
  }, [comments])

  const addComment = useCallback((id, comment) => {
    setComments((current) => ({
      ...current,
      [id]: [...(current[id] || []), comment],
    }))
  }, [])

  const renameComments = useCallback((from, to) => {
    setComments((current) => {
      if (!current[from]) return current
      const next = { ...current, [to]: current[from] }
      delete next[from]
      return next
    })
  }, [])

  return { comments, addComment, renameComments }
}

function relativeDate(date) {
  const timestamp = new Date(date).getTime()
  if (!Number.isFinite(timestamp)) return date
  const days = Math.round((timestamp - Date.now()) / 86400000)
  const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })
  if (Math.abs(days) < 30) return formatter.format(days, 'day')
  if (Math.abs(days) < 365) return formatter.format(Math.round(days / 30), 'month')
  return formatter.format(Math.round(days / 365), 'year')
}

function Diagram({ nodes }) {
  if (!nodes.length) {
    return <div className="diagram-empty">Add diagram nodes in edit mode.</div>
  }
  return (
    <div className="diagram-flow" aria-label="Project architecture diagram">
      {nodes.map((node, index) => (
        <div className="diagram-step" key={`${node.id}-${index}`}>
          {index > 0 && <span className="diagram-arrow" aria-hidden="true">→</span>}
          <div className={`diagram-node diagram-node--${node.kind}`}>
            <span className="diagram-node-kind">{node.kind}</span>
            <span>{node.label}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

const codePattern =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:const|int|float|bool|void|if|else|for|while|return|true|false|HIGH|LOW|INPUT|OUTPUT|A\d+|Serial|delay|digitalWrite|digitalRead|analogRead|pinMode|tone|println|begin)\b|\b\d+(?:\.\d+)?\b)/g

function HighlightedCode({ code }) {
  let cursor = 0
  const tokens = []
  for (const match of code.matchAll(codePattern)) {
    if (match.index > cursor) tokens.push(code.slice(cursor, match.index))
    const token = match[0]
    const type = token.startsWith('//') || token.startsWith('/*')
      ? 'comment'
      : token.startsWith('"') || token.startsWith("'")
        ? 'string'
        : /^\d/.test(token)
          ? 'number'
          : 'keyword'
    tokens.push(
      <span className={`code-${type}`} key={`${match.index}-${token}`}>
        {token}
      </span>,
    )
    cursor = match.index + token.length
  }
  if (cursor < code.length) tokens.push(code.slice(cursor))
  return <pre className="code-preview"><code>{tokens}</code></pre>
}

function CommentThread({ project, comments, onAddComment }) {
  const [expanded, setExpanded] = useState(false)
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [error, setError] = useState(null)
  const threadId = `comments-${project.id}`

  function submitComment(event) {
    event.preventDefault()
    const result = moderate(name, text)
    if (!result.valid) {
      setError(result)
      return
    }
    onAddComment(project.id, {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: result.name,
      text: result.text,
      date: new Date().toISOString(),
    })
    setName('')
    setText('')
    setError(null)
  }

  return (
    <div className="comment-section">
      <button
        className="engagement-action"
        type="button"
        aria-expanded={expanded}
        aria-controls={threadId}
        onClick={() => setExpanded((current) => !current)}
      >
        <span aria-hidden="true">↳</span>
        Comment
        <span className="action-count">{comments.length}</span>
      </button>
      <div className={`comment-thread ${expanded ? 'is-expanded' : ''}`} id={threadId}>
        {expanded && (
          <>
            <div className="comment-list" aria-live="polite">
              {comments.length === 0 ? (
                <p className="comment-empty">No comments yet. Start the conversation.</p>
              ) : (
                comments.map((comment) => (
                  <article className="comment" key={comment.id}>
                    <div className="comment-heading">
                      <strong>{comment.name}</strong>
                      <time dateTime={comment.date}>{relativeDate(comment.date)}</time>
                    </div>
                    <p>{comment.text}</p>
                  </article>
                ))
              )}
            </div>
            <form className="comment-form" onSubmit={submitComment} noValidate>
              <label>
                <span>Your name</span>
                <input
                  maxLength={40}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  aria-invalid={error?.field === 'name'}
                  aria-describedby={error?.field === 'name' ? `${threadId}-error` : undefined}
                />
              </label>
              <label>
                <span>Comment</span>
                <textarea
                  maxLength={500}
                  rows={3}
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  aria-invalid={error?.field === 'text'}
                  aria-describedby={error?.field === 'text' ? `${threadId}-error` : undefined}
                />
              </label>
              {error && (
                <p className="inline-error" id={`${threadId}-error`} role="alert">
                  {error.message}
                </p>
              )}
              <button className="button button--small" type="submit">Post comment</button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

function ProjectCard({
  project,
  vote,
  comments,
  onVote,
  onAddComment,
  onShare,
  onEdit,
  onDelete,
  onMove,
  isOwner,
  isPreview = false,
}) {
  const [showDiagram, setShowDiagram] = useState(null)
  const [diagramVisible, setDiagramVisible] = useState(true)
  const liked = vote === 'like'
  const disliked = vote === 'dislike'
  const diagramIsShown = showDiagram ?? project.type === 'software'

  const typeLabel = project.typeLabel || (project.type === 'software' ? 'Software' : 'Hardware')

  return (
    <article className="project-card" id={project.id}>
      <header className="project-card-header">
        <div className="project-card-title">
          <span className={`project-type project-type--${project.type}`}>
            {typeLabel}
          </span>
          <h2>{project.title}</h2>
        </div>
        <time className="project-date" dateTime={project.date} title={project.date}>
          {relativeDate(project.date)}
        </time>
      </header>
      <p className="project-description">{project.description}</p>
      <div className="project-links">
        <button
          className="diagram-toggle"
          type="button"
          aria-pressed={project.type === 'software' ? diagramVisible : diagramIsShown}
          onClick={() => {
            if (project.type === 'software') {
              setDiagramVisible((current) => !current)
              return
            }
            setShowDiagram((current) => !(current ?? project.type === 'software'))
          }}
        >
          🖼️ Architectural Diagram
          <span>{project.type === 'software' ? (diagramVisible ? 'Showing diagram' : 'Show diagram') : (diagramIsShown ? 'Showing diagram' : 'Show diagram')}</span>
        </button>
        {project.type === 'software' && (
          project.url ? (
            <a href={project.url} target="_blank" rel="noopener noreferrer">
              🔗 Visit Website ↗
            </a>
          ) : (
            <span className="project-link-empty" aria-disabled="true" title="Add a URL in owner mode">
              🔗 Visit Website ↗ <small>(not added)</small>
            </span>
          )
        )}
      </div>
      <div className={`project-preview ${project.type === 'hardware' ? 'project-preview--hardware' : ''}`}>
        {project.type === 'software' ? (
          diagramVisible ? (
            <Diagram nodes={project.nodes} />
          ) : (
            <div className="diagram-hidden">Diagram hidden</div>
          )
        ) : diagramIsShown ? (
          <Diagram nodes={project.nodes} />
        ) : (
          <HighlightedCode code={project.code || '// Add a C++ example in edit mode.'} />
        )}
      </div>
      <div className="engagement-bar">
        <div className="vote-actions" aria-label="Rate this project">
          <button
            className={`engagement-action ${liked ? 'is-selected' : ''}`}
            type="button"
            aria-pressed={liked}
            disabled={Boolean(vote) || isPreview}
            onClick={() => onVote(project.id, 'like')}
          >
            <span aria-hidden="true">↑</span> Like
            <span className="action-count">{Number(project.likes) + Number(liked)}</span>
          </button>
          <button
            className={`engagement-action ${disliked ? 'is-selected' : ''}`}
            type="button"
            aria-pressed={disliked}
            disabled={Boolean(vote) || isPreview}
            onClick={() => onVote(project.id, 'dislike')}
          >
            <span aria-hidden="true">↓</span> Dislike
            <span className="action-count">{Number(project.dislikes) + Number(disliked)}</span>
          </button>
        </div>
        {!isPreview && (
          <div className="engagement-secondary">
            <CommentThread
              project={project}
              comments={comments}
              onAddComment={onAddComment}
            />
            <button className="engagement-action" type="button" onClick={() => onShare(project)}>
              <span aria-hidden="true">↗</span> Share
            </button>
          </div>
        )}
      </div>
      {!isPreview && isOwner && (
        <div className="owner-card-actions" aria-label={`Manage ${project.title}`}>
          <button type="button" onClick={() => onEdit(project)}>Edit</button>
          <button type="button" onClick={() => onDelete(project.id)}>Delete</button>
          <button type="button" onClick={() => onMove(project.id, -1)}>Move up</button>
          <button type="button" onClick={() => onMove(project.id, 1)}>Move down</button>
        </div>
      )}
    </article>
  )
}

function newProject() {
  return {
    id: `project-${Date.now().toString(36)}`,
    type: 'software',
    title: '',
    date: new Date().toISOString().slice(0, 10),
    description: '',
    url: '',
    nodes: [],
    likes: 0,
    dislikes: 0,
  }
}

function ProjectEditor({ project, projects, onClose, onSave }) {
  const [draft, setDraft] = useState(() => ({
    ...project,
    nodes: (project.nodes || []).map((node) => ({ ...node })),
  }))
  const [errors, setErrors] = useState({})
  const firstField = useRef(null)

  useEffect(() => {
    firstField.current?.focus()
    function closeOnEscape(event) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  function update(field, value) {
    setDraft((current) => ({ ...current, [field]: value }))
  }

  function updateNode(index, field, value) {
    setDraft((current) => ({
      ...current,
      nodes: current.nodes.map((node, nodeIndex) =>
        nodeIndex === index ? { ...node, [field]: value } : node,
      ),
    }))
  }

  function addNode() {
    setDraft((current) => ({
      ...current,
      nodes: [
        ...current.nodes,
        {
          id: `node-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
          label: 'New component',
          kind: 'service',
        },
      ],
    }))
  }

  function moveNode(index, offset) {
    setDraft((current) => {
      const nextIndex = index + offset
      if (nextIndex < 0 || nextIndex >= current.nodes.length) return current
      const nodes = [...current.nodes]
      ;[nodes[index], nodes[nextIndex]] = [nodes[nextIndex], nodes[index]]
      return { ...current, nodes }
    })
  }

  function removeNode(index) {
    setDraft((current) => ({
      ...current,
      nodes: current.nodes.filter((_, nodeIndex) => nodeIndex !== index),
    }))
  }

  function submit(event) {
    event.preventDefault()
    const nextErrors = {}
    const id = draft.id.trim()
    const title = draft.title.trim()
    const description = draft.description.trim()
    const nodes = draft.nodes.map((node) => ({
      id: node.id.trim(),
      label: node.label.trim(),
      kind: node.kind,
    }))

    if (!id || !/^[a-z0-9][a-z0-9-]*$/i.test(id)) {
      nextErrors.id = 'Use letters, numbers, and hyphens for the project ID.'
    } else if (projects.some((item) => item.id === id && item.id !== project.id)) {
      nextErrors.id = 'This project ID is already in use.'
    }
    if (!title || title.length > 100) nextErrors.title = 'Title is required (100 characters max).'
    if (!draft.date || !Number.isFinite(new Date(draft.date).getTime())) {
      nextErrors.date = 'Choose a valid date.'
    }
    if (!description || description.length > 1000) {
      nextErrors.description = 'Description is required (1,000 characters max).'
    }
    if (nodes.some((node) =>
      !node.id ||
      !/^[a-z0-9][a-z0-9-]*$/i.test(node.id) ||
      !node.label ||
      node.label.length > 60 ||
      !['input', 'service', 'data', 'output'].includes(node.kind),
    )) {
      nextErrors.nodes = 'Each node needs an ID and a label (60 characters max).'
    } else if (new Set(nodes.map((node) => node.id)).size !== nodes.length) {
      nextErrors.nodes = 'Each diagram node must have a unique ID.'
    }
    if (draft.type === 'software' && draft.url && !/^https?:\/\/\S+$/i.test(draft.url.trim())) {
      nextErrors.url = 'Enter a complete http:// or https:// URL.'
    }
    if (draft.type === 'hardware' && typeof draft.code !== 'string') {
      nextErrors.code = 'C++ code must be text.'
    }
    const likes = Number(draft.likes)
    const dislikes = Number(draft.dislikes)
    if (!Number.isInteger(likes) || likes < 0) nextErrors.likes = 'Enter a whole number of 0 or more.'
    if (!Number.isInteger(dislikes) || dislikes < 0) {
      nextErrors.dislikes = 'Enter a whole number of 0 or more.'
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    const saved = {
      id,
      type: draft.type,
      title,
      date: draft.date,
      description,
      nodes,
      likes,
      dislikes,
      ...(draft.type === 'software' ? { url: draft.url.trim() } : { code: draft.code || '' }),
    }
    onSave(saved, project.id)
  }

  return (
    <div className="editor-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <section
        className="project-editor"
        role="dialog"
        aria-modal="true"
        aria-labelledby="editor-title"
      >
        <div className="editor-heading">
          <div>
            <p className="eyebrow">OWNER MODE</p>
            <h2 id="editor-title">{project.title ? 'Edit project' : 'Add project'}</h2>
          </div>
          <button className="icon-button" type="button" aria-label="Close editor" onClick={onClose}>
            ×
          </button>
        </div>
        <form className="editor-layout" onSubmit={submit} noValidate>
          <div className="editor-fields">
            <label>
              Project type
              <select
                value={draft.type}
                onChange={(event) => {
                  const type = event.target.value
                  setDraft((current) => ({
                    ...current,
                    type,
                    ...(type === 'software'
                      ? { url: current.url || '', code: undefined }
                      : { code: current.code || '', url: undefined }),
                  }))
                }}
              >
                <option value="software">Software</option>
                <option value="hardware">Hardware</option>
              </select>
            </label>
            <label>
              Project ID
              <input
                ref={firstField}
                value={draft.id}
                onChange={(event) => update('id', event.target.value)}
                aria-invalid={Boolean(errors.id)}
              />
              {errors.id && <span className="inline-error">{errors.id}</span>}
            </label>
            <label>
              Title
              <input
                maxLength={100}
                value={draft.title}
                onChange={(event) => update('title', event.target.value)}
                aria-invalid={Boolean(errors.title)}
              />
              {errors.title && <span className="inline-error">{errors.title}</span>}
            </label>
            <label>
              Date
              <input
                type="date"
                value={draft.date}
                onChange={(event) => update('date', event.target.value)}
                aria-invalid={Boolean(errors.date)}
              />
              {errors.date && <span className="inline-error">{errors.date}</span>}
            </label>
            <label>
              Description
              <textarea
                maxLength={1000}
                rows={4}
                value={draft.description}
                onChange={(event) => update('description', event.target.value)}
                aria-invalid={Boolean(errors.description)}
              />
              {errors.description && <span className="inline-error">{errors.description}</span>}
            </label>
            {draft.type === 'software' ? (
              <label>
                Website URL
                <input
                  type="url"
                  value={draft.url || ''}
                  onChange={(event) => update('url', event.target.value)}
                  aria-invalid={Boolean(errors.url)}
                  placeholder="https://"
                />
                {errors.url && <span className="inline-error">{errors.url}</span>}
              </label>
            ) : (
              <label>
                C++ code
                <textarea
                  className="editor-code"
                  rows={10}
                  value={draft.code || ''}
                  onChange={(event) => update('code', event.target.value)}
                  aria-invalid={Boolean(errors.code)}
                />
                {errors.code && <span className="inline-error">{errors.code}</span>}
              </label>
            )}
            <div className="diagram-section">
              <span>Architecture diagram nodes</span>
              <span className="field-hint">
                Add components and choose a type. Their order controls the live diagram flow.
              </span>
              <div className="diagram-node-editor">
                {draft.nodes.map((node, index) => (
                  <div className="diagram-node-fields" key={`${node.id}-${index}`}>
                    <label>
                      Node ID
                      <input
                        value={node.id}
                        maxLength={60}
                        onChange={(event) => updateNode(index, 'id', event.target.value)}
                        aria-label={`Node ${index + 1} ID`}
                      />
                    </label>
                    <label>
                      Label
                      <input
                        value={node.label}
                        maxLength={60}
                        onChange={(event) => updateNode(index, 'label', event.target.value)}
                        aria-label={`Node ${index + 1} label`}
                      />
                    </label>
                    <label>
                      Type
                      <select
                        value={node.kind}
                        onChange={(event) => updateNode(index, 'kind', event.target.value)}
                        aria-label={`Node ${index + 1} type`}
                      >
                        <option value="input">Input</option>
                        <option value="service">Process / service</option>
                        <option value="data">Data</option>
                        <option value="output">Output</option>
                      </select>
                    </label>
                    <div className="node-actions">
                      <button
                        type="button"
                        aria-label={`Move node ${index + 1} up`}
                        disabled={index === 0}
                        onClick={() => moveNode(index, -1)}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        aria-label={`Move node ${index + 1} down`}
                        disabled={index === draft.nodes.length - 1}
                        onClick={() => moveNode(index, 1)}
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        aria-label={`Remove node ${index + 1}`}
                        onClick={() => removeNode(index)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <button className="button button--quiet" type="button" onClick={addNode}>
                  + Add diagram node
                </button>
                {errors.nodes && <span className="inline-error">{errors.nodes}</span>}
              </div>
            </div>
            <div className="editor-count-fields">
              <label>
                Likes
                <input type="number" min="0" step="1" value={draft.likes} onChange={(event) => update('likes', event.target.value)} />
                {errors.likes && <span className="inline-error">{errors.likes}</span>}
              </label>
              <label>
                Dislikes
                <input type="number" min="0" step="1" value={draft.dislikes} onChange={(event) => update('dislikes', event.target.value)} />
                {errors.dislikes && <span className="inline-error">{errors.dislikes}</span>}
              </label>
            </div>
            <div className="editor-actions">
              <button className="button" type="submit">Save project</button>
              <button className="button button--quiet" type="button" onClick={onClose}>Cancel</button>
            </div>
          </div>
          <div className="editor-preview">
            <p className="eyebrow">LIVE VISITOR PREVIEW</p>
            <ProjectCard
              key={draft.type}
              project={{
                ...draft,
                title: draft.title || 'Untitled project',
                description: draft.description || 'Your project description will appear here.',
                likes: Number(draft.likes) || 0,
                dislikes: Number(draft.dislikes) || 0,
              }}
              vote={null}
              comments={[]}
              onVote={() => {}}
              onAddComment={() => {}}
              onShare={() => {}}
              isOwner={false}
              isPreview
            />
          </div>
        </form>
      </section>
    </div>
  )
}

function ProjectDataDialog({ mode, projects, onClose, onImport, notify }) {
  const [value, setValue] = useState(mode === 'export' ? JSON.stringify(projects, null, 2) : '')
  const [error, setError] = useState('')
  const textArea = useRef(null)

  async function copyExport() {
    try {
      await navigator.clipboard.writeText(value)
      notify('Project JSON copied. Paste it into PROJECTS in src/data/projects.js.')
    } catch {
      textArea.current?.focus()
      textArea.current?.select()
      notify('Select the JSON block and copy it manually.', true)
    }
  }

  function importData() {
    try {
      const parsed = JSON.parse(value)
      if (!isProjectList(parsed)) {
        throw new Error('JSON must be an array of valid projects with unique IDs.')
      }
      onImport(parsed)
      onClose()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not import this JSON.')
    }
  }

  return (
    <div className="editor-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <section className="data-dialog" role="dialog" aria-modal="true" aria-labelledby="data-dialog-title">
        <div className="editor-heading">
          <div>
            <p className="eyebrow">PROJECT DATA</p>
            <h2 id="data-dialog-title">{mode === 'export' ? 'Export JSON' : 'Import JSON'}</h2>
          </div>
          <button className="icon-button" type="button" aria-label="Close dialog" onClick={onClose}>×</button>
        </div>
        <p className="field-hint">
          {mode === 'export'
            ? 'This is a valid JavaScript array. Copy it into src/data/projects.js as the value of PROJECTS.'
            : 'Import an array of project objects. This replaces the current locally saved project list.'}
        </p>
        <textarea
          ref={textArea}
          className="data-textarea"
          rows={18}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          spellCheck="false"
          aria-label="Project JSON"
        />
        {error && <p className="inline-error" role="alert">{error}</p>}
        <div className="editor-actions">
          {mode === 'export' ? (
            <button className="button" type="button" onClick={copyExport}>Copy JSON</button>
          ) : (
            <button className="button" type="button" onClick={importData}>Import projects</button>
          )}
          <button className="button button--quiet" type="button" onClick={onClose}>Close</button>
        </div>
      </section>
    </div>
  )
}

function Projects() {
  const { projects, updateProjects, storageAvailable } = useProjects()
  const { votes, vote, renameVote } = useVotes()
  const { comments, addComment, renameComments } = useComments()
  const [, setCurrentTime] = useState(() => Date.now())
  const [ownerMode, setOwnerMode] = useState(() => window.location.hash === '#edit')
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('newest')
  const [editorProject, setEditorProject] = useState(null)
  const [dataDialog, setDataDialog] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    const interval = window.setInterval(() => setCurrentTime(Date.now()), 60_000)
    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    const syncOwnerMode = () => setOwnerMode(window.location.hash === '#edit')
    window.addEventListener('hashchange', syncOwnerMode)
    return () => window.removeEventListener('hashchange', syncOwnerMode)
  }, [])

  useEffect(() => {
    function ownerShortcut(event) {
      if (
        event.ctrlKey &&
        event.shiftKey &&
        event.key.toLowerCase() === 'e' &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)
      ) {
        event.preventDefault()
        window.location.hash = ownerMode ? '' : 'edit'
      }
    }
    window.addEventListener('keydown', ownerShortcut)
    return () => window.removeEventListener('keydown', ownerShortcut)
  }, [ownerMode])

  useEffect(() => {
    if (!toast) return undefined
    const timeout = window.setTimeout(() => setToast(null), 3600)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const visibleProjects = useMemo(() => {
    const filtered = projects.filter((project) => filter === 'all' || project.type === filter)
    if (sort === 'manual') return filtered
    return [...filtered].sort((a, b) => {
      const direction = sort === 'newest' ? -1 : 1
      return (new Date(a.date).getTime() - new Date(b.date).getTime()) * direction
    })
  }, [filter, projects, sort])

  function notify(message, isError = false) {
    setToast({ message, isError })
  }

  async function shareProject(project) {
    const shareUrl = new URL(window.location.href)
    shareUrl.hash = project.id
    const shareData = { title: project.title, text: project.description, url: shareUrl.toString() }
    try {
      if (navigator.share) {
        await navigator.share(shareData)
        notify('Project shared.')
      } else {
        await navigator.clipboard.writeText(shareUrl.toString())
        notify('Project link copied to clipboard.')
      }
    } catch (error) {
      if (error?.name === 'AbortError') return
      try {
        await navigator.clipboard.writeText(shareUrl.toString())
        notify('Project link copied to clipboard.')
      } catch {
        notify('Could not access sharing or clipboard. Copy the page URL to share.', true)
      }
    }
  }

  function saveProject(project, previousId) {
    updateProjects((current) => {
      const index = current.findIndex((item) => item.id === previousId)
      if (index < 0) return [...current, project]
      return current.map((item, itemIndex) => itemIndex === index ? project : item)
    })
    if (previousId !== project.id) {
      renameVote(previousId, project.id)
      renameComments(previousId, project.id)
    }
    setFilter('all')
    setEditorProject(null)
    notify('Project saved.')
  }

  function deleteProject(id) {
    const project = projects.find((item) => item.id === id)
    if (!window.confirm(`Delete "${project?.title || 'this project'}"?`)) return
    updateProjects((current) => current.filter((item) => item.id !== id))
    notify('Project deleted.')
  }

  function moveProject(id, offset) {
    const ordered = sort === 'manual'
      ? [...projects]
      : [...projects].sort((a, b) => {
          const direction = sort === 'newest' ? -1 : 1
          return (new Date(a.date).getTime() - new Date(b.date).getTime()) * direction
        })
    const visible = ordered.filter((project) => filter === 'all' || project.type === filter)
    const index = visible.findIndex((project) => project.id === id)
    const target = visible[index + offset]
    if (index < 0 || !target) return
    const next = [...ordered]
    const currentIndex = next.findIndex((project) => project.id === id)
    const targetIndex = next.findIndex((project) => project.id === target.id)
    ;[next[currentIndex], next[targetIndex]] = [next[targetIndex], next[currentIndex]]
    updateProjects(next)
    setSort('manual')
  }

  function resetProjects() {
    if (!window.confirm('Reset projects to the original portfolio examples?')) return
    updateProjects(PROJECTS)
    setFilter('all')
    setSort('newest')
    notify('Projects reset to the original examples.')
  }

  function exitOwnerMode() {
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
    setOwnerMode(false)
    notify('Owner mode closed.')
  }

  return (
    <main className="project-dashboard">
      <div className="dashboard-shell">
        <header className="dashboard-heading">
          <div className="dashboard-heading-copy">
            <p className="eyebrow">SELECTED WORK · {String(projects.length).padStart(2, '0')} PROJECTS</p>
            <h1>Projects<span>.</span></h1>
            <p className="dashboard-intro">
              A collection of things built with curiosity — from software to circuits.
            </p>
          </div>
          <div className="dashboard-controls">
            <div className="filter-tabs" aria-label="Filter projects">
              {[
                ['all', 'All'],
                ['software', 'Software'],
                ['hardware', 'Hardware'],
              ].map(([value, label]) => (
                <button
                  className={filter === value ? 'filter-tab is-active' : 'filter-tab'}
                  key={value}
                  type="button"
                  aria-pressed={filter === value}
                  onClick={() => setFilter(value)}
                >
                  {label}
                </button>
              ))}
            </div>
            <label className="sort-control">
              <span>Sort by</span>
              <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort projects by date">
                <option value="manual">Custom order</option>
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </label>
          </div>
        </header>

        {!storageAvailable && (
          <p className="storage-note" role="status">
            Browser storage is blocked. You can still use the page, but votes, comments, and edits may not persist.
          </p>
        )}

        {visibleProjects.length ? (
          <section className="project-grid" aria-label="Projects">
            {visibleProjects.map((project) => (
              <ProjectCard
                key={`${project.id}-${project.type}`}
                project={project}
                vote={votes[project.id]}
                comments={comments[project.id] || []}
                onVote={vote}
                onAddComment={addComment}
                onShare={shareProject}
                onEdit={(item) => setEditorProject(item)}
                onDelete={deleteProject}
                onMove={moveProject}
                isOwner={ownerMode}
              />
            ))}
          </section>
        ) : (
          <section className="empty-state">
            <span aria-hidden="true">◇</span>
            <h2>No projects here yet</h2>
            <p>Try another filter or add a project in owner mode.</p>
          </section>
        )}
        <p className="moderation-note">
          <span aria-hidden="true">ⓘ</span> Comments are filtered in this browser. Local votes and moderation are helpful
          friction, not security controls: visitors can clear or bypass local storage and client-side checks.
        </p>
      </div>

      {ownerMode && (
        <aside className="owner-toolbar" aria-label="Owner tools">
          <span className="owner-status"><i /> Owner mode</span>
          <button className="button" type="button" onClick={() => setEditorProject(newProject())}>
            + Add project
          </button>
          <button className="button button--quiet" type="button" onClick={resetProjects}>Reset</button>
          <button className="button button--quiet" type="button" onClick={() => setDataDialog('export')}>Export JSON</button>
          <button className="button button--quiet" type="button" onClick={() => setDataDialog('import')}>Import JSON</button>
          <button className="button button--quiet" type="button" onClick={exitOwnerMode}>Exit edit mode</button>
        </aside>
      )}

      {editorProject && (
        <ProjectEditor
          project={editorProject}
          projects={projects}
          onClose={() => setEditorProject(null)}
          onSave={saveProject}
        />
      )}
      {dataDialog && (
        <ProjectDataDialog
          mode={dataDialog}
          projects={projects}
          onClose={() => setDataDialog(null)}
          onImport={(items) => {
            updateProjects(items)
            notify('Projects imported.')
          }}
          notify={notify}
        />
      )}
      {toast && (
        <div className={`toast ${toast.isError ? 'toast--error' : ''}`} role="status" aria-live="polite">
          {toast.message}
        </div>
      )}
    </main>
  )
}

export default Projects
