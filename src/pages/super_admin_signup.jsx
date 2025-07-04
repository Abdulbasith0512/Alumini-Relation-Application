/* ───── src/pages/super_admin_signup.jsx ───── */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SuperAdminNavbar from '../components/super_admin_navbar';
import './super_admin_signup.css';

/* ←────────────  change this if your API runs elsewhere  ────────────→ */
const API_BASE =
  import.meta.env.VITE_API_URL || 'http://localhost:3001';

const FIELD_LIST_CORE = [
  'name',
  'enrollmentNumber',
  'email',
  'batchYear',
  'degree',
  'mobileNumber',
  'otp',
  'password',
  'Profile_photo',
];

const INPUT_TYPES = ['text', 'number', 'email', 'date', 'file'];

export default function SignupFormConfig() {
  /* ────────────  state  ──────────── */
  const [config, setConfig] = useState(null);    // { visibleFields, customFields }
  const [saving, setSaving] = useState(false);
  const [newField, setNewField] = useState({
    key: '',
    label: '',
    type: 'text',
    required: false,
  });

  /* ────────────  get config once  ──────────── */
  useEffect(() => {
    axios.get(`${API_BASE}/api/signup-config`)
      .then(({ data }) =>
        setConfig({
          visibleFields: data.visibleFields ?? {},
          customFields: data.customFields ?? [],
        }),
      )
      .catch(err => console.error('Config fetch error', err));
  }, []);

  if (!config) return <p className="p-4">Loading…</p>;

  /* ────────────  helpers  ──────────── */
  const toggleCore = (field) =>
    setConfig(c => ({
      ...c,
      visibleFields: { ...c.visibleFields, [field]: !c.visibleFields[field] },
    }));

  const toggleCustom = (idx) =>
    setConfig(c => {
      const cf = [...c.customFields];
      cf[idx] = { ...cf[idx], visible: !cf[idx].visible };
      return { ...c, customFields: cf };
    });

  const saveConfig = () => {
    setSaving(true);
    axios.put(`${API_BASE}/api/signup-config`, config)
      .then(() => alert('Settings saved!'))
      .catch(err => alert(err.response?.data?.error || 'Save failed'))
      .finally(() => setSaving(false));
  };

  const addField = () => {
    axios.post(`${API_BASE}/api/signup-config/field`, newField)
      .then(({ data }) =>
        setConfig(c => ({ ...c, customFields: data.customFields })),
      )
      .then(() => setNewField({ key: '', label: '', type: 'text', required: false }))
      .catch(err => alert(err.response?.data?.error || 'Could not add field'));
  };

  /* ────────────  render  ──────────── */
  return (
    <>
      <SuperAdminNavbar />
<div className="super-admin-container p-4 max-w-xl mx-auto">
  <h2 className="super-admin-heading text-xl font-semibold mb-4">
    Signup Form Settings
  </h2>

  {/* core toggles */}
  <h3 className="super-admin-subheading font-medium">Core fields</h3>
  {FIELD_LIST_CORE.map(f => (
    <label key={f} className="super-admin-core-field block">
      <input
        type="checkbox"
        checked={!!config.visibleFields[f]}
        onChange={() => toggleCore(f)}
      />{' '}
      {f}
    </label>
  ))}

  {/* custom toggles */}
  <h3 className="super-admin-subheading font-medium mt-6">Custom fields</h3>
  {config.customFields.length === 0 && (
    <p className="super-admin-no-fields text-sm text-gray-500">
      No custom fields yet.
    </p>
  )}
  {config.customFields.map((field, i) => (
    <label key={field.key} className="super-admin-custom-field block">
      <input
        type="checkbox"
        checked={field.visible}
        onChange={() => toggleCustom(i)}
      />{' '}
      {field.label} ({field.type})
    </label>
  ))}

  {/* add new */}
  <div className="super-admin-add-new mt-6 border-t pt-4">
    <h4 className="super-admin-add-title font-medium mb-2">Add new field</h4>
    <input
      className="super-admin-input border p-1 mr-2"
      placeholder="key (e.g. linkedin)"
      value={newField.key}
      onChange={e => setNewField(n => ({ ...n, key: e.target.value }))}
    />
    <input
      className="super-admin-input border p-1 mr-2"
      placeholder="Label (LinkedIn URL)"
      value={newField.label}
      onChange={e => setNewField(n => ({ ...n, label: e.target.value }))}
    />
    <select
      className="super-admin-select border p-1 mr-2"
      value={newField.type}
      onChange={e => setNewField(n => ({ ...n, type: e.target.value }))}
    >
      {INPUT_TYPES.map(t => (
        <option key={t}>{t}</option>
      ))}
    </select>
    <label className="super-admin-required-label mr-2">
      <input
        type="checkbox"
        checked={newField.required}
        onChange={e =>
          setNewField(n => ({ ...n, required: e.target.checked }))
        }
      />{' '}
      required
    </label>
    <button onClick={addField} className="super-admin-btn btn">
      Add
    </button>
  </div>

<button
  onClick={saveConfig}
  disabled={saving}
  className="super-admin-save-btn btn mt-4 flex items-center gap-2"
>
  {saving && <span className="spinner">⏳</span>}
  {saving ? 'Saving…' : 'Save all changes'}
</button>


</div>
    </>
  );
}
