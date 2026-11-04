/**
 * Shared pieces of Verify ID and address (Figma page "Verify ID and address" EN 326:36305 / AR 326:36899):
 *  HubStep — hub step card (32 number / check badge · title + hint · status pill or lock); current = White + 2px
 *    Primary/Red border, locked = Fog + Silver border at 70%, done = Status/Success badge.
 *  UploadSheet (4.5a / 4.8) — title + close, body, accepted-documents card, 3 source options, formats caption.
 *  DocCard (4.5 / 4.5b / 4.7 / 4.8a) — red badge + title + hint or file; Secondary upload button, or Small Tonal
 *    Preview · Replace · Remove when a file is attached.
 *  RemoveSheet (4.5d / 4.8c) and DocPreview (4.5c / 4.8b, full-screen overlay).
 */
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText, Button, Icon, IconBadge, IconButton, Illustration, Screen, SheetHeader, type IconName } from '../../components';
import { ltr } from '../../utils/format';
import { useTheme } from '../../theme';

export type DocKind = 'id' | 'address';
export type UploadedFile = { name: string; size: string } | null;

export function HubStep({ n, title, hint, status, state }: { n: number; title: string; hint: string; status?: string; state: 'current' | 'locked' | 'done' }) {
  const t = useTheme();
  const current = state === 'current';
  const locked = state === 'locked';
  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/16'], padding: t.spacing['spacing/16'], borderRadius: t.radius['radius/lg'],
      backgroundColor: t.colors[locked ? 'Neutral/Fog' : 'Neutral/White'],
      borderWidth: t.stroke[current ? 'stroke/xl' : 'stroke/xs'],
      borderColor: t.colors[current ? 'Primary/Red' : locked ? 'Neutral/Silver' : 'Neutral/Dark Fog'],
      opacity: locked ? 0.7 : 1,
    }}>
      {state === 'done' ? <IconBadge icon="check" size={32} tone="success" /> : (
        <View style={[styles.center, { width: t.sizes.limitStep.badge, height: t.sizes.limitStep.badge, borderRadius: t.radius['radius/full'], backgroundColor: t.colors[current ? 'Primary/Red' : 'Neutral/White'] }]}>
          <AppText variant="Body Medium" color={current ? 'Neutral/White' : 'Neutral/Slate'}>{String(n)}</AppText>
        </View>
      )}
      <View style={styles.flex}>
        <AppText variant="Body Medium">{title}</AppText>
        <AppText variant="Caption" color="Neutral/Slate">{hint}</AppText>
      </View>
      {locked ? <Icon name="lock" size={t.sizes.textField.lock} color="Neutral/Slate" /> : status ? (
        <View style={{ paddingHorizontal: t.spacing['spacing/8'], borderRadius: t.radius['radius/full'], backgroundColor: t.colors[state === 'done' ? 'Status/Success/Light' : 'Neutral/Fog'] }}>
          <AppText variant="Caption" color={state === 'done' ? 'Status/Success/Default' : 'Neutral/Slate'}>{status}</AppText>
        </View>
      ) : null}
    </View>
  );
}

function SourceRow({ icon, label, onPress }: { icon: IconName; label: string; onPress: () => void }) {
  const t = useTheme();
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => [{ flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/12'], minHeight: t.sizes.listRow.minHeight, paddingHorizontal: t.spacing['spacing/16'], borderRadius: t.radius['radius/lg'], backgroundColor: t.colors[pressed ? 'Neutral/Dark Fog' : 'Neutral/Fog'] }]}>
      <IconBadge icon={icon} size={40} tone="redTint" />
      <AppText variant="Body Medium" style={styles.flex}>{label}</AppText>
      <Icon name="chevronRight" size={t.sizes.icon.sm} color="Neutral/Slate" />
    </Pressable>
  );
}

export function UploadSheetBody({ kind, onClose, onPick }: { kind: DocKind; onClose: () => void; onPick: () => void }) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const k = 'verify.upload';
  const list = tr(`${k}.${kind}List`, { returnObjects: true }) as string[];
  return (
    <>
      <SheetHeader title={tr(`${k}.${kind}Title`)} onClose={onClose} />
      <AppText variant="Body" color="Neutral/Slate">{tr(`${k}.${kind}Body`)}</AppText>
      <View style={{ gap: t.spacing['spacing/8'], padding: t.spacing['spacing/16'], borderRadius: t.radius['radius/lg'], borderWidth: t.stroke['stroke/xs'], borderColor: t.colors['Neutral/Dark Fog'] }}>
        <AppText variant="Body Medium">{tr(`${k}.${kind}Accepted`)}</AppText>
        {list.map((d) => (
          <View key={d} style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/8'] }}>
            <Icon name="file" size={t.sizes.icon.sm} color="Primary/Red" />
            <AppText variant="Body">{d}</AppText>
          </View>
        ))}
        <AppText variant="Caption" color="Neutral/Slate">{tr(`${k}.${kind}Rule`)}</AppText>
      </View>
      <View style={{ gap: t.spacing['spacing/8'] }}>
        <SourceRow icon="camera" label={tr(`${k}.camera`)} onPress={onPick} />
        <SourceRow icon="image" label={tr(`${k}.gallery`)} onPress={onPick} />
        <SourceRow icon="file" label={tr(`${k}.file`)} onPress={onPick} />
      </View>
      <AppText variant="Caption" color="Neutral/Slate" style={{ textAlign: 'center' }}>{tr(`${k}.formats`)}</AppText>
    </>
  );
}

export function DocCard({ title, hint, file, uploadLabel, onUpload, onPreview, onRemove }: {
  title: string; hint: string; file: UploadedFile; uploadLabel: string; onUpload: () => void; onPreview: () => void; onRemove: () => void;
}) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  return (
    <View style={{ gap: t.spacing['spacing/16'], padding: t.spacing['spacing/16'], borderRadius: t.radius['radius/lg'], borderWidth: t.stroke['stroke/xs'], borderColor: t.colors['Neutral/Silver'], backgroundColor: t.colors['Neutral/White'] }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.spacing['spacing/16'] }}>
        <View style={[styles.center, { width: t.sizes.listRow.badge, height: t.sizes.listRow.badge, borderRadius: t.radius['radius/full'], backgroundColor: t.colors[file ? 'Status/Success/Default' : 'Primary/Red'] }]}>
          <Icon name={file ? 'check' : 'home'} size={t.sizes.icon.md} color="Neutral/White" />
        </View>
        <View style={styles.flex}>
          <AppText variant="Body Medium">{title}</AppText>
          <AppText variant="Caption" color="Neutral/Slate">{file ? ltr(`${file.name} · ${file.size}`) : hint}</AppText>
        </View>
      </View>
      {file ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: t.spacing['spacing/8'] }}>
          <Button size="small" type="tonal" icon="eye" label={tr('verify.upload.preview')} onPress={onPreview} />
          <Button size="small" type="tonal" icon="refresh" label={tr('verify.upload.replace')} onPress={onUpload} />
          <Button size="small" type="tonal" icon="trash" label={tr('verify.upload.remove')} onPress={onRemove} />
        </View>
      ) : (
        <Button type="secondary" label={uploadLabel} onPress={onUpload} testID="upload" />
      )}
    </View>
  );
}

export function RemoveSheetBody({ kind, onRemove, onKeep }: { kind: DocKind; onRemove: () => void; onKeep: () => void }) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  return (
    <>
      <View style={{ gap: t.spacing['spacing/8'] }}>
        <AppText variant="H3" accessibilityRole="header">{tr('verify.upload.removeTitle')}</AppText>
        <AppText variant="Body" color="Neutral/Slate">{tr(kind === 'id' ? 'verify.upload.removeIdBody' : 'verify.upload.removeAddressBody')}</AppText>
      </View>
      <Button label={tr('verify.upload.remove')} onPress={onRemove} testID="confirm-remove" />
      <Button type="ghost" label={tr('verify.upload.keep')} onPress={onKeep} />
    </>
  );
}

export function DocPreview({ kind, file, visible, onClose, onReplace }: { kind: DocKind; file: UploadedFile; visible: boolean; onClose: () => void; onReplace: () => void }) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  if (!visible || !file) return null;
  const body = (
    <Screen>
      <View style={{ paddingTop: t.spacing['spacing/8'], paddingHorizontal: t.layout.screenGutter, alignItems: 'flex-start' }}>
        <IconButton icon="x" surface accessibilityLabel={tr('common.close')} onPress={onClose} />
      </View>
      <View style={{ flex: 1, padding: t.layout.screenGutter, gap: t.spacing['spacing/16'] }}>
        <View>
          <AppText variant="H3" accessibilityRole="header">{tr(kind === 'id' ? 'verify.upload.idTitle' : 'verify.upload.addressTitle')}</AppText>
          <AppText variant="Caption" color="Neutral/Slate">{ltr(`${file.name} · ${file.size}`)} · {tr('verify.upload.uploadedToday')}</AppText>
        </View>
        <View style={[styles.flex, styles.center, { borderRadius: t.radius['radius/xl'], backgroundColor: t.colors['Neutral/Fog'] }]}>
          {kind === 'id' ? <Illustration name="idCard" /> : <Icon name="file" size={t.sizes.biometric.icon} color="Primary/Red" />}
        </View>
      </View>
      <View style={{ paddingHorizontal: t.layout.screenGutter, paddingBottom: t.spacing['spacing/40'], gap: t.spacing['spacing/8'] }}>
        <Button label={tr('verify.upload.done')} onPress={onClose} testID="preview-done" />
        <Button type="secondary" label={tr('verify.upload.replace')} onPress={onReplace} />
      </View>
    </Screen>
  );
  return <Modal visible transparent={false} animationType="slide" onRequestClose={onClose}>{body}</Modal>;
}

const styles = StyleSheet.create({ flex: { flex: 1 }, center: { alignItems: 'center', justifyContent: 'center' } });
