import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, MapPin, Building2, Link as LinkIcon, Mail, Twitter, Calendar, Users,
  GitFork, Star, Code2, FileText, BookMarked, Boxes, ChevronDown, ChevronUp,
  ExternalLink, Hash, Scale, Eye, AlertCircle, Globe, Database,
} from 'lucide-react';

interface Props {
  userData: any;
  repos: any[];
  orgs: any[];
  gists: any[];
  starred: any[];
  socialAccounts: any[];
  followers: any[];
  following: any[];
}

const fmtDate = (d?: string) => (d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—');

function Section({ icon, title, count, children, defaultOpen = false }: {
  icon: React.ReactNode; title: string; count?: number; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="glass-panel overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 p-4 hover:bg-muted/20 transition-colors">
        <span className="text-primary">{icon}</span>
        <h3 className="font-semibold text-foreground">{title}</h3>
        {count !== undefined && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{count}</span>
        )}
        <span className="ml-auto text-muted-foreground">{open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</span>
      </button>
      {open && <div className="border-t border-border/50 p-4">{children}</div>}
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div className="flex flex-col gap-0.5 p-2.5 rounded-lg bg-muted/20">
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className={`text-sm text-foreground break-words ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
    </div>
  );
}

const socialIcon = (provider: string) => {
  const p = provider?.toLowerCase();
  if (p === 'twitter' || p === 'x') return <Twitter className="w-3.5 h-3.5" />;
  return <LinkIcon className="w-3.5 h-3.5" />;
};

export function GitHubDataExplorer({ userData, repos, orgs, gists, starred, socialAccounts, followers, following }: Props) {
  if (!userData) return null;

  return (
    <div className="space-y-4">
      <div className="glass-panel p-5 flex items-center gap-3">
        <Database className="w-5 h-5 text-primary" />
        <div>
          <h2 className="font-semibold text-foreground">Complete GitHub Data</h2>
          <p className="text-xs text-muted-foreground">Every field returned by the GitHub public API for @{userData.login}.</p>
        </div>
      </div>

      {/* Full profile */}
      <Section icon={<User className="w-4 h-4" />} title="Profile" defaultOpen>
        <div className="flex items-start gap-4 mb-4">
          <img src={userData.avatar_url} alt={userData.login} className="w-16 h-16 rounded-2xl border border-border" />
          <div>
            <p className="text-lg font-bold text-foreground">{userData.name || userData.login}</p>
            <p className="text-sm text-muted-foreground">@{userData.login} · ID {userData.id}</p>
            {userData.bio && <p className="text-sm text-foreground/80 mt-1">{userData.bio}</p>}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          <Field label="Type" value={userData.type} />
          <Field label="Company" value={userData.company} />
          <Field label="Location" value={userData.location} />
          <Field label="Email" value={userData.email} />
          <Field label="Blog / Website" value={userData.blog ? <a href={userData.blog.startsWith('http') ? userData.blog : `https://${userData.blog}`} target="_blank" rel="noreferrer" className="text-primary hover:underline">{userData.blog}</a> : null} />
          <Field label="Twitter" value={userData.twitter_username ? `@${userData.twitter_username}` : null} />
          <Field label="Hireable" value={userData.hireable === null ? 'Not set' : userData.hireable ? 'Yes' : 'No'} />
          <Field label="Public Repos" value={userData.public_repos} />
          <Field label="Public Gists" value={userData.public_gists} />
          <Field label="Followers" value={userData.followers} />
          <Field label="Following" value={userData.following} />
          <Field label="Created" value={fmtDate(userData.created_at)} />
          <Field label="Last Updated" value={fmtDate(userData.updated_at)} />
          <Field label="Profile URL" value={<a href={userData.html_url} target="_blank" rel="noreferrer" className="text-primary hover:underline">{userData.html_url}</a>} />
          <Field label="Node ID" value={userData.node_id} mono />
        </div>
      </Section>

      {/* Social accounts */}
      {socialAccounts?.length > 0 && (
        <Section icon={<LinkIcon className="w-4 h-4" />} title="Social Accounts" count={socialAccounts.length}>
          <div className="flex flex-wrap gap-2">
            {socialAccounts.map((s: any, i: number) => (
              <a key={i} href={s.url} target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-muted/30 text-foreground hover:bg-muted/50 transition-colors">
                {socialIcon(s.provider)} <span className="capitalize">{s.provider}</span>
              </a>
            ))}
          </div>
        </Section>
      )}

      {/* Organizations */}
      {orgs?.length > 0 && (
        <Section icon={<Building2 className="w-4 h-4" />} title="Organizations" count={orgs.length}>
          <div className="flex flex-wrap gap-3">
            {orgs.map((o: any) => (
              <a key={o.id} href={`https://github.com/${o.login}`} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 p-2 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                <img src={o.avatar_url} alt={o.login} className="w-8 h-8 rounded-lg" />
                <span className="text-sm text-foreground">{o.login}</span>
              </a>
            ))}
          </div>
        </Section>
      )}

      {/* Followers / Following */}
      {(followers?.length > 0 || following?.length > 0) && (
        <div className="grid md:grid-cols-2 gap-4">
          {followers?.length > 0 && (
            <Section icon={<Users className="w-4 h-4" />} title="Followers" count={followers.length}>
              <div className="flex flex-wrap gap-2">
                {followers.map((f: any) => (
                  <a key={f.id} href={f.html_url} target="_blank" rel="noreferrer" title={f.login}>
                    <img src={f.avatar_url} alt={f.login} className="w-9 h-9 rounded-full border border-border hover:scale-110 transition-transform" />
                  </a>
                ))}
              </div>
            </Section>
          )}
          {following?.length > 0 && (
            <Section icon={<Users className="w-4 h-4" />} title="Following" count={following.length}>
              <div className="flex flex-wrap gap-2">
                {following.map((f: any) => (
                  <a key={f.id} href={f.html_url} target="_blank" rel="noreferrer" title={f.login}>
                    <img src={f.avatar_url} alt={f.login} className="w-9 h-9 rounded-full border border-border hover:scale-110 transition-transform" />
                  </a>
                ))}
              </div>
            </Section>
          )}
        </div>
      )}

      {/* Gists */}
      {gists?.length > 0 && (
        <Section icon={<BookMarked className="w-4 h-4" />} title="Public Gists" count={gists.length}>
          <div className="space-y-2">
            {gists.map((g: any) => (
              <a key={g.id} href={g.html_url} target="_blank" rel="noreferrer"
                className="block p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span className="text-sm text-foreground truncate">{g.description || Object.keys(g.files || {})[0] || 'Untitled gist'}</span>
                  <span className="ml-auto text-[10px] text-muted-foreground shrink-0">{fmtDate(g.created_at)}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {Object.values(g.files || {}).map((f: any, i: number) => (
                    <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                      {f.filename}{f.language ? ` · ${f.language}` : ''}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </Section>
      )}

      {/* Starred repos */}
      {starred?.length > 0 && (
        <Section icon={<Star className="w-4 h-4" />} title="Recently Starred" count={starred.length}>
          <div className="space-y-2">
            {starred.map((r: any) => (
              <a key={r.id} href={r.html_url} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                <Code2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span className="text-sm text-foreground truncate">{r.full_name}</span>
                {r.language && <span className="text-[10px] text-muted-foreground shrink-0">{r.language}</span>}
                <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                  <Star className="w-3 h-3 text-terminal-yellow" />{(r.stargazers_count || 0).toLocaleString()}
                </span>
              </a>
            ))}
          </div>
        </Section>
      )}

      {/* All repositories full metadata */}
      {repos?.length > 0 && (
        <Section icon={<Boxes className="w-4 h-4" />} title="All Repositories" count={repos.length}>
          <div className="space-y-2">
            {repos.map((r: any) => (
              <details key={r.id} className="group rounded-lg bg-muted/20 overflow-hidden">
                <summary className="flex items-center gap-2 p-3 cursor-pointer list-none hover:bg-muted/30">
                  <Code2 className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="text-sm font-medium text-foreground truncate">{r.name}</span>
                  {r.fork && <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">fork</span>}
                  {r.archived && <span className="text-[9px] px-1.5 py-0.5 rounded bg-terminal-yellow/15 text-terminal-yellow">archived</span>}
                  <span className="ml-auto flex items-center gap-3 text-xs text-muted-foreground shrink-0">
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 text-terminal-yellow" />{r.stargazers_count}</span>
                    <span className="flex items-center gap-1"><GitFork className="w-3 h-3 text-terminal-cyan" />{r.forks_count}</span>
                  </span>
                </summary>
                <div className="px-3 pb-3 pt-1 space-y-2">
                  {r.description && <p className="text-xs text-muted-foreground">{r.description}</p>}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <Field label="Language" value={r.language} />
                    <Field label="License" value={r.license?.spdx_id || r.license?.name} />
                    <Field label="Size" value={`${((r.size || 0) / 1024).toFixed(2)} MB`} />
                    <Field label="Default Branch" value={r.default_branch} />
                    <Field label="Watchers" value={r.watchers_count} />
                    <Field label="Open Issues" value={r.open_issues_count} />
                    <Field label="Visibility" value={r.visibility || (r.private ? 'private' : 'public')} />
                    <Field label="Created" value={fmtDate(r.created_at)} />
                    <Field label="Updated" value={fmtDate(r.updated_at)} />
                    <Field label="Pushed" value={fmtDate(r.pushed_at)} />
                    <Field label="Homepage" value={r.homepage ? <a href={r.homepage} target="_blank" rel="noreferrer" className="text-primary hover:underline">link</a> : null} />
                    <Field label="Issues Enabled" value={r.has_issues ? 'Yes' : 'No'} />
                  </div>
                  {r.topics?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {r.topics.map((t: string) => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">{t}</span>
                      ))}
                    </div>
                  )}
                  <a href={r.html_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                    <ExternalLink className="w-3 h-3" /> View on GitHub
                  </a>
                </div>
              </details>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
