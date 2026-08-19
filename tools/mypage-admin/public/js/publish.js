import { api } from './api.js';
import { escapeHTML } from './html.js';

const terminalStates = new Set(['success', 'error']);

function statusLabel(status) {
    if (status === '??') return '新增';
    if (status.includes('D')) return '删除';
    if (status.includes('A')) return '新增';
    return '修改';
}

export class PublishingController {
    constructor({ dialog, onSuccess, notify }) {
        this.dialog = dialog;
        this.onSuccess = onSuccess;
        this.notify = notify;
        this.preparation = null;
        this.job = null;
        this.pollTimer = null;
        this.dialog.querySelector('#confirmPublish').addEventListener('click', () => this.start());
        this.dialog.querySelector('#closePublish').addEventListener('click', () => this.close());
        this.dialog.querySelector('#retryPublish').addEventListener('click', () => this.retryPush());
        this.dialog.querySelector('#retryDeploy').addEventListener('click', () => this.retryDeploy());
    }

    async prepare(title) {
        this.title = title;
        this.reset();
        this.dialog.showModal();
        this.setSummary('正在检查 Git、生成静态数据并审计文章…', 'loading');
        try {
            this.preparation = await api('/api/publish/prepare', { method: 'POST', body: '{}' });
            this.renderPreparation();
        } catch (error) {
            this.setSummary(error.message, 'error');
            this.notify(error.message, 'error');
        }
    }

    reset() {
        clearTimeout(this.pollTimer);
        this.preparation = null;
        this.job = null;
        this.dialog.querySelector('#publishFiles').innerHTML = '';
        this.dialog.querySelector('#excludedDrafts').innerHTML = '';
        this.dialog.querySelector('#publishSteps').innerHTML = '';
        this.dialog.querySelector('#confirmPublish').hidden = true;
        this.dialog.querySelector('#retryPublish').hidden = true;
        this.dialog.querySelector('#retryDeploy').hidden = true;
    }

    setSummary(text, state = '') {
        const summary = this.dialog.querySelector('#publishSummary');
        summary.textContent = text;
        summary.dataset.state = state;
    }

    renderPreparation() {
        if (!this.preparation.ready) {
            this.setSummary(this.preparation.message, 'neutral');
            this.renderExcluded();
            return;
        }
        const additions = this.preparation.files.reduce((sum, file) => sum + file.added, 0);
        const deletions = this.preparation.files.reduce((sum, file) => sum + file.deleted, 0);
        this.setSummary(`${this.preparation.files.length} 个文件待发布 · +${additions} / -${deletions}`, 'ready');
        this.dialog.querySelector('#publishFiles').innerHTML = this.preparation.files.map(file => `
            <li>
                <span class="change-kind">${statusLabel(file.status)}</span>
                <code>${escapeHTML(file.file)}</code>
                <span class="diff-stat">+${file.added} / -${file.deleted}</span>
            </li>
        `).join('');
        this.renderExcluded();
        this.dialog.querySelector('#confirmPublish').hidden = false;
    }

    renderExcluded() {
        const drafts = this.preparation?.excludedDraftFiles || [];
        const container = this.dialog.querySelector('#excludedDrafts');
        if (!drafts.length) {
            container.innerHTML = '<p>没有被排除的本地草稿。</p>';
            return;
        }
        container.innerHTML = `<p>${drafts.length} 个草稿文件仅保留在本机：</p><ul>${drafts.map(file => `<li><code>${escapeHTML(file.file)}</code></li>`).join('')}</ul>`;
    }

    async start() {
        if (!this.preparation?.confirmationId) return;
        const button = this.dialog.querySelector('#confirmPublish');
        button.disabled = true;
        try {
            this.job = await api('/api/publish/jobs', {
                method: 'POST',
                body: JSON.stringify({ confirmationId: this.preparation.confirmationId, title: this.title })
            });
            this.renderJob();
            this.poll();
        } catch (error) {
            button.disabled = false;
            this.setSummary(error.message, 'error');
        }
    }

    renderJob() {
        this.dialog.querySelector('#confirmPublish').hidden = true;
        this.dialog.querySelector('#publishSteps').innerHTML = this.job.steps.map(step => `
            <li data-state="${step.state}">
                <span class="step-indicator" aria-hidden="true"></span>
                <div><strong>${escapeHTML(step.label)}</strong><small>${escapeHTML(step.detail || step.state)}</small></div>
            </li>
        `).join('');
        if (this.job.state === 'success') {
            this.setSummary(`发布完成 · ${this.job.commit.slice(0, 8)}`, 'success');
            this.notify('GitHub Pages 与 VPS 已同步', 'success');
            this.onSuccess?.(this.job);
        } else if (this.job.state === 'error') {
            this.setSummary(this.job.error, 'error');
            this.notify(this.job.error, 'error');
            this.dialog.querySelector('#retryPublish').hidden = !(this.job.phase === 'push' && this.job.commit);
            this.dialog.querySelector('#retryDeploy').hidden = this.job.phase !== 'deploy';
        } else {
            this.setSummary('正在发布，请保持后台窗口打开。', 'loading');
        }
    }

    async poll() {
        if (!this.job || terminalStates.has(this.job.state)) return;
        try {
            this.job = await api(`/api/publish/jobs/${this.job.id}`);
            this.renderJob();
            if (!terminalStates.has(this.job.state)) this.pollTimer = setTimeout(() => this.poll(), 900);
        } catch (error) {
            this.setSummary(error.message, 'error');
        }
    }

    async retryPush() {
        this.job = await api(`/api/publish/jobs/${this.job.id}/retry`, { method: 'POST', body: '{}' });
        this.renderJob();
        this.poll();
    }

    async retryDeploy() {
        this.job = await api('/api/deploy/jobs', { method: 'POST', body: '{}' });
        this.renderJob();
        this.poll();
    }

    close() {
        if (this.job && !terminalStates.has(this.job.state)) {
            this.notify('发布任务仍在运行，完成后才能关闭面板。', 'warning');
            return;
        }
        this.dialog.close();
    }
}
