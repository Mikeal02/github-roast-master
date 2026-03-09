import { useState } from 'react';
import { FileDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

interface PDFReportExportProps {
  username: string;
  userData: any;
  aiAnalysis: any;
  isRecruiterMode: boolean;
  userRepos: any[];
}

const getGradeLabel = (s: number) => {
  if (s >= 90) return { grade: 'S', label: 'Legendary' };
  if (s >= 80) return { grade: 'A', label: 'Elite' };
  if (s >= 70) return { grade: 'B', label: 'Strong' };
  if (s >= 55) return { grade: 'C', label: 'Decent' };
  if (s >= 35) return { grade: 'D', label: 'Weak' };
  return { grade: 'F', label: 'Critical' };
};

export function PDFReportExport({ username, userData, aiAnalysis, isRecruiterMode, userRepos }: PDFReportExportProps) {
  const [generating, setGenerating] = useState(false);

  const generatePDF = async () => {
    setGenerating(true);
    toast.info('📄 Generating PDF report...');

    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;
      let y = 0;

      const colors = {
        bg: [13, 15, 20] as [number, number, number],
        card: [22, 26, 35] as [number, number, number],
        primary: [99, 102, 241] as [number, number, number],
        accent: [244, 63, 94] as [number, number, number],
        green: [34, 197, 94] as [number, number, number],
        yellow: [250, 204, 21] as [number, number, number],
        cyan: [6, 182, 212] as [number, number, number],
        white: [255, 255, 255] as [number, number, number],
        muted: [148, 163, 184] as [number, number, number],
        border: [51, 65, 85] as [number, number, number],
      };

      const drawBg = () => {
        doc.setFillColor(...colors.bg);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');
      };

      const checkNewPage = (needed: number) => {
        if (y + needed > pageHeight - margin) {
          doc.addPage();
          drawBg();
          y = margin;
        }
      };

      const drawSectionTitle = (title: string, emoji: string) => {
        checkNewPage(20);
        doc.setFillColor(...colors.card);
        doc.roundedRect(margin, y, contentWidth, 10, 2, 2, 'F');
        doc.setTextColor(...colors.primary);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`${emoji}  ${title}`, margin + 4, y + 7);
        y += 14;
      };

      const drawKeyValue = (key: string, value: string, x?: number, maxW?: number) => {
        const xPos = x || margin + 4;
        doc.setTextColor(...colors.muted);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(key, xPos, y);
        doc.setTextColor(...colors.white);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text(value, xPos, y + 4.5);
        y += 11;
      };

      const drawProgressBar = (label: string, value: number, color: [number, number, number]) => {
        checkNewPage(10);
        doc.setTextColor(...colors.muted);
        doc.setFontSize(8);
        doc.text(label, margin + 4, y + 3);
        // Bar bg
        const barX = margin + 50;
        const barW = contentWidth - 70;
        doc.setFillColor(51, 65, 85);
        doc.roundedRect(barX, y, barW, 4, 1, 1, 'F');
        // Bar fill
        doc.setFillColor(...color);
        doc.roundedRect(barX, y, barW * (value / 100), 4, 1, 1, 'F');
        // Value
        doc.setTextColor(...color);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text(`${value}`, margin + contentWidth - 8, y + 3);
        y += 8;
      };

      const getScoreColor = (s: number): [number, number, number] => {
        if (s >= 70) return colors.green;
        if (s >= 50) return colors.yellow;
        if (s >= 30) return colors.cyan;
        return colors.accent;
      };

      // ===== COVER PAGE =====
      drawBg();

      // Gradient accent bar at top
      doc.setFillColor(...colors.primary);
      doc.rect(0, 0, pageWidth, 4, 'F');
      doc.setFillColor(...colors.accent);
      doc.rect(pageWidth / 2, 0, pageWidth / 2, 4, 'F');

      // Title block
      y = 80;
      doc.setTextColor(...colors.white);
      doc.setFontSize(36);
      doc.setFont('helvetica', 'bold');
      doc.text(isRecruiterMode ? 'DEVELOPER' : 'GITHUB', pageWidth / 2, y, { align: 'center' });
      y += 14;
      doc.setTextColor(...colors.primary);
      doc.setFontSize(36);
      doc.text(isRecruiterMode ? 'ASSESSMENT' : 'ROAST', pageWidth / 2, y, { align: 'center' });
      y += 14;
      doc.setTextColor(...colors.accent);
      doc.setFontSize(36);
      doc.text('REPORT', pageWidth / 2, y, { align: 'center' });

      // Username
      y += 30;
      doc.setFillColor(...colors.card);
      doc.roundedRect(pageWidth / 2 - 40, y - 8, 80, 16, 4, 4, 'F');
      doc.setTextColor(...colors.white);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(`@${username}`, pageWidth / 2, y + 2, { align: 'center' });

      // Overall score
      const overall = aiAnalysis.scores?.overall?.score || 0;
      const gradeInfo = getGradeLabel(overall);
      y += 30;
      doc.setTextColor(...colors.muted);
      doc.setFontSize(10);
      doc.text('OVERALL SCORE', pageWidth / 2, y, { align: 'center' });
      y += 12;
      doc.setTextColor(...getScoreColor(overall));
      doc.setFontSize(48);
      doc.setFont('helvetica', 'bold');
      doc.text(`${overall}`, pageWidth / 2, y, { align: 'center' });
      y += 8;
      doc.setFontSize(14);
      doc.text(`Grade ${gradeInfo.grade} • ${gradeInfo.label}`, pageWidth / 2, y, { align: 'center' });

      // Meta info
      y += 25;
      doc.setTextColor(...colors.muted);
      doc.setFontSize(8);
      doc.text(`Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, pageWidth / 2, y, { align: 'center' });
      y += 5;
      doc.text(`Mode: ${isRecruiterMode ? 'Recruiter Assessment' : 'Roast Mode'} • Powered by RoastMyGit AI`, pageWidth / 2, y, { align: 'center' });

      // Accent bar at bottom
      doc.setFillColor(...colors.primary);
      doc.rect(0, pageHeight - 4, pageWidth, 4, 'F');

      // ===== PAGE 2: PROFILE OVERVIEW =====
      doc.addPage();
      drawBg();
      y = margin;

      drawSectionTitle('Profile Overview', '👤');

      const profileData = [
        ['Name', userData.name || username],
        ['Bio', (userData.bio || 'No bio').substring(0, 80)],
        ['Location', userData.location || 'Unknown'],
        ['Company', userData.company || 'N/A'],
        ['Public Repos', `${userData.public_repos}`],
        ['Followers', `${userData.followers?.toLocaleString()}`],
        ['Following', `${userData.following?.toLocaleString()}`],
        ['Account Created', new Date(userData.created_at).toLocaleDateString()],
      ];

      profileData.forEach(([k, v]) => {
        checkNewPage(12);
        drawKeyValue(k, v);
      });

      // ===== SCORES =====
      y += 6;
      drawSectionTitle('Score Breakdown', '🎯');

      const scoreCategories = [
        { key: 'activity', label: 'Activity' },
        { key: 'documentation', label: 'Documentation' },
        { key: 'popularity', label: 'Popularity' },
        { key: 'diversity', label: 'Diversity' },
        { key: 'codeQuality', label: 'Code Quality' },
        { key: 'collaboration', label: 'Collaboration' },
      ];

      scoreCategories.forEach(cat => {
        const score = aiAnalysis.scores?.[cat.key]?.score || 0;
        drawProgressBar(cat.label, score, getScoreColor(score));
      });

      // Sub-metrics
      scoreCategories.forEach(cat => {
        const subMetrics = aiAnalysis.scores?.[cat.key]?.subMetrics;
        if (subMetrics && Object.keys(subMetrics).length > 0) {
          checkNewPage(20);
          y += 3;
          doc.setTextColor(...colors.white);
          doc.setFontSize(9);
          doc.setFont('helvetica', 'bold');
          doc.text(`${cat.label} Sub-Metrics:`, margin + 4, y);
          y += 5;
          Object.entries(subMetrics).forEach(([key, value]) => {
            const v = value as number;
            const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
            drawProgressBar(`  ${label}`, v, getScoreColor(v));
          });
        }
      });

      // ===== LANGUAGES =====
      doc.addPage();
      drawBg();
      y = margin;

      drawSectionTitle('Language Distribution', '💻');

      const langEntries = Object.entries(aiAnalysis.languages || {}).sort((a: any, b: any) => b[1] - a[1]);
      const langTotal = langEntries.reduce((s, [, v]) => s + (v as number), 0);

      langEntries.slice(0, 12).forEach(([lang, count]) => {
        const pct = Math.round(((count as number) / langTotal) * 100);
        drawProgressBar(lang, pct, colors.cyan);
      });

      // ===== TECH ANALYSIS =====
      if (aiAnalysis.techAnalysis) {
        y += 6;
        drawSectionTitle('Technical Assessment', '🛡️');
        
        const ta = aiAnalysis.techAnalysis;
        drawKeyValue('Primary Domain', ta.primaryDomain || 'N/A');
        drawKeyValue('Seniority Estimate', ta.seniorityEstimate || 'N/A');
        drawKeyValue('Architecture Style', ta.architectureStyle || 'N/A');
        drawKeyValue('Open Source Engagement', ta.openSourceEngagement || 'N/A');

        if (ta.strengthAreas?.length) {
          checkNewPage(15);
          doc.setTextColor(...colors.muted);
          doc.setFontSize(8);
          doc.text('Strengths:', margin + 4, y);
          y += 5;
          ta.strengthAreas.forEach((s: string) => {
            checkNewPage(6);
            doc.setTextColor(...colors.green);
            doc.setFontSize(8);
            doc.text(`  ✓ ${s}`, margin + 6, y);
            y += 5;
          });
        }

        if (ta.growthAreas?.length) {
          y += 2;
          doc.setTextColor(...colors.muted);
          doc.setFontSize(8);
          doc.text('Growth Areas:', margin + 4, y);
          y += 5;
          ta.growthAreas.forEach((g: string) => {
            checkNewPage(6);
            doc.setTextColor(...colors.yellow);
            doc.setFontSize(8);
            doc.text(`  △ ${g}`, margin + 6, y);
            y += 5;
          });
        }
      }

      // ===== TOP REPOSITORIES =====
      if (aiAnalysis.topRepositories?.length) {
        doc.addPage();
        drawBg();
        y = margin;

        drawSectionTitle('Top Repositories', '📁');

        aiAnalysis.topRepositories.slice(0, 10).forEach((repo: any, i: number) => {
          checkNewPage(20);
          doc.setFillColor(...colors.card);
          doc.roundedRect(margin, y, contentWidth, 14, 2, 2, 'F');

          doc.setTextColor(...colors.white);
          doc.setFontSize(9);
          doc.setFont('helvetica', 'bold');
          doc.text(`#${i + 1}  ${repo.name}`, margin + 4, y + 5);

          doc.setTextColor(...colors.muted);
          doc.setFontSize(7);
          doc.setFont('helvetica', 'normal');
          doc.text(`⭐ ${repo.stars}  🍴 ${repo.forks}  ${repo.language || ''}`, margin + 4, y + 11);
          
          if (repo.description) {
            doc.setTextColor(...colors.muted);
            doc.setFontSize(7);
            const desc = repo.description.length > 80 ? repo.description.substring(0, 80) + '...' : repo.description;
            doc.text(desc, margin + 60, y + 5);
          }

          y += 17;
        });
      }

      // ===== PERSONALITY =====
      if (aiAnalysis.personality) {
        checkNewPage(80);
        y += 6;
        drawSectionTitle('Personality Profile', '🧠');

        const p = aiAnalysis.personality;
        drawKeyValue('Personality Type', `${p.personalityType?.emoji || ''} ${p.personalityType?.type || 'N/A'}`);
        drawKeyValue('Focus Type', p.focusType || 'N/A');
        drawKeyValue('Learning Style', p.learningStyle || 'N/A');
        drawKeyValue('Peak Activity Day', p.peakActivityDay || 'N/A');

        if (p.metrics) {
          y += 2;
          drawProgressBar('Consistency', p.metrics.consistency || 0, colors.green);
          drawProgressBar('Exploration', p.metrics.exploration || 0, colors.cyan);
          drawProgressBar('Collaboration', p.metrics.collaboration || 0, colors.primary);
          drawProgressBar('Documentation', p.metrics.documentation || 0, colors.yellow);
        }

        if (p.burnoutRisk !== undefined) {
          y += 2;
          drawProgressBar('Burnout Risk', p.burnoutRisk, p.burnoutRisk > 60 ? colors.accent : colors.green);
          drawProgressBar('Procrastination', p.procrastinationTendency || 0, (p.procrastinationTendency || 0) > 60 ? colors.accent : colors.green);
        }

        if (p.funInsights?.length) {
          checkNewPage(30);
          y += 4;
          doc.setTextColor(...colors.yellow);
          doc.setFontSize(9);
          doc.setFont('helvetica', 'bold');
          doc.text('Fun Insights:', margin + 4, y);
          y += 6;
          p.funInsights.slice(0, 5).forEach((insight: string) => {
            checkNewPage(8);
            doc.setTextColor(...colors.white);
            doc.setFontSize(7.5);
            doc.setFont('helvetica', 'normal');
            const lines = doc.splitTextToSize(`✨ ${insight}`, contentWidth - 10);
            doc.text(lines, margin + 6, y);
            y += lines.length * 4 + 2;
          });
        }
      }

      // ===== ACTIVITY STATS =====
      doc.addPage();
      drawBg();
      y = margin;

      drawSectionTitle('Activity & Streaks', '🔥');

      drawKeyValue('Current Streak', `${aiAnalysis.currentStreak || 0} days`);
      drawKeyValue('Longest Streak', `${aiAnalysis.longestStreak || 0} days`);
      drawKeyValue('Active Days', `${aiAnalysis.activeDays || 0}`);
      drawKeyValue('Peak Coding Hour', aiAnalysis.peakCodingHour || 'N/A');
      drawKeyValue('Peak Coding Day', aiAnalysis.peakCodingDay || 'N/A');
      drawKeyValue('Weekend Ratio', `${aiAnalysis.weekendRatio || 0}%`);
      drawKeyValue('Total Events', `${aiAnalysis.totalEvents || 0}`);

      // ===== DEVELOPER DNA SUMMARY =====
      y += 6;
      drawSectionTitle('Developer DNA', '🧬');

      const dnaItems = [
        { label: 'Total Stars', value: `${aiAnalysis.totalStars || 0}` },
        { label: 'Total Forks', value: `${aiAnalysis.totalForks || 0}` },
        { label: 'Original Repos', value: `${aiAnalysis.originalRepos || 0}` },
        { label: 'Forked Repos', value: `${aiAnalysis.forkedRepos || 0}` },
        { label: 'Repos with README', value: `${aiAnalysis.reposWithDescription || 0}` },
        { label: 'Organizations', value: `${aiAnalysis.orgCount || 0}` },
        { label: 'Public Gists', value: `${aiAnalysis.publicGists || 0}` },
        { label: 'Codebase Size', value: `${aiAnalysis.totalRepoSizeMB || 0} MB` },
      ];

      dnaItems.forEach(item => {
        checkNewPage(12);
        drawKeyValue(item.label, item.value);
      });

      // ===== CAREER INSIGHTS =====
      if (aiAnalysis.careerInsights) {
        checkNewPage(50);
        y += 6;
        drawSectionTitle('Career Insights', '💼');

        const ci = aiAnalysis.careerInsights;
        drawKeyValue('Work Style', ci.workStyle || 'N/A');
        drawKeyValue('Growth Trajectory', ci.growthTrajectory || 'N/A');
        drawKeyValue('Team Fit', ci.teamFit || 'N/A');
        if (ci.salaryTier) drawKeyValue('Salary Tier', ci.salaryTier);

        if (ci.idealRoles?.length) {
          checkNewPage(12);
          doc.setTextColor(...colors.muted);
          doc.setFontSize(8);
          doc.text('Ideal Roles:', margin + 4, y);
          y += 5;
          doc.setTextColor(...colors.primary);
          doc.setFontSize(8);
          doc.text(ci.idealRoles.join('  •  '), margin + 6, y);
          y += 6;
        }

        if (ci.industryFit?.length) {
          checkNewPage(12);
          doc.setTextColor(...colors.muted);
          doc.setFontSize(8);
          doc.text('Industry Fit:', margin + 4, y);
          y += 5;
          doc.setTextColor(...colors.cyan);
          doc.setFontSize(8);
          doc.text(ci.industryFit.join('  •  '), margin + 6, y);
          y += 6;
        }
      }

      // ===== ROAST LINES / ASSESSMENT =====
      if (aiAnalysis.roastLines?.length) {
        checkNewPage(30);
        y += 6;
        drawSectionTitle(isRecruiterMode ? 'Assessment Notes' : 'Roast Lines', isRecruiterMode ? '📋' : '🔥');

        aiAnalysis.roastLines.slice(0, 8).forEach((line: string) => {
          checkNewPage(10);
          doc.setTextColor(...colors.white);
          doc.setFontSize(7.5);
          const lines = doc.splitTextToSize(`${isRecruiterMode ? '▸' : '🔥'} ${line}`, contentWidth - 10);
          doc.text(lines, margin + 4, y);
          y += lines.length * 4 + 3;
        });
      }

      // ===== FOOTER on last page =====
      doc.setTextColor(...colors.muted);
      doc.setFontSize(7);
      doc.text('Generated by RoastMyGit • roastmygit.lovable.app', pageWidth / 2, pageHeight - 8, { align: 'center' });

      // Save
      doc.save(`${username}-${isRecruiterMode ? 'assessment' : 'roast'}-report.pdf`);
      toast.success('📄 PDF report downloaded!');
    } catch (err) {
      console.error('PDF generation error:', err);
      toast.error('Failed to generate PDF');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Button variant="outline" size="sm" className="gap-2" onClick={generatePDF} disabled={generating}>
      {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
      {generating ? 'Generating...' : 'PDF Report'}
    </Button>
  );
}
