import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { AlertCircle } from "lucide-react";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { 
  AssignmentDialog, 
  ConflictSummaryPanel, 
  UndoRedoControls, 
  HolidayCalendarDialog, 
  CopyWeekDialog 
} from "@/components/timetable";
import { examBlocks } from "@/data/examBlockData";
import { useTimetableWorkspace } from "@/hooks/useTimetableWorkspace";
import { 
  BatchPickerDialog, 
  TimetableToolbar, 
  TimetableSidebar, 
  TimetableGridSection 
} from "@/components/timetable/workspace";
import { toast } from "sonner";

const Timetable = () => {
  const navigate = useNavigate();
  const workspace = useTimetableWorkspace();

  return (
    <div className="space-y-3">
      {/* Mobile Guidance Notice */}
      <div className="block md:hidden p-3 rounded-lg bg-amber-50 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-800">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Best on larger screens</p>
            <p className="text-xs text-amber-600 dark:text-amber-400">
              For full editing with drag-and-drop, use a tablet or desktop. 
              <button 
                onClick={() => navigate('/institute/timetable/view')}
                className="underline ml-1 font-medium"
              >
                View Timetable →
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Compact Header */}
      <PageHeader
        title="Timetable Workspace"
        actions={
          <div className="flex items-center gap-2">
            <UndoRedoControls
              canUndo={workspace.canUndo}
              canRedo={workspace.canRedo}
              onUndo={workspace.handleUndoClick}
              onRedo={workspace.handleRedoClick}
              lastAction={workspace.lastAction}
              nextAction={workspace.nextAction}
            />
          </div>
        }
      />

      {/* Compact All-in-One Toolbar */}
      <TimetableToolbar
        currentWeekStart={workspace.currentWeekStart}
        weekEndDate={workspace.weekEndDate}
        goToPreviousWeek={workspace.goToPreviousWeek}
        goToNextWeek={workspace.goToNextWeek}
        goToCurrentWeek={workspace.goToCurrentWeek}
        viewMode={workspace.viewMode}
        setViewMode={workspace.setViewMode}
        setSelectedBatchId={workspace.setSelectedBatchId}
        conflictCount={workspace.conflictCount}
        conflictPanelOpen={workspace.conflictPanelOpen}
        setConflictPanelOpen={workspace.setConflictPanelOpen}
        saveStatus={workspace.saveStatus}
        handleSaveDraft={workspace.handleSaveDraft}
        handlePublish={workspace.handlePublish}
        onUploadClick={() => navigate("/institute/timetable/upload")}
        onCopyWeekClick={() => workspace.setCopyWeekDialogOpen(true)}
        onSetupClick={() => navigate("/institute/timetable/setup")}
        onViewClick={() => navigate("/institute/timetable/view")}
        entriesCount={workspace.entries.length}
      />

      {/* Collapsible Conflict Panel */}
      <Collapsible open={workspace.conflictPanelOpen} onOpenChange={workspace.setConflictPanelOpen}>
        <CollapsibleContent>
          <ConflictSummaryPanel
            entries={workspace.entries}
            teachers={workspace.teacherLoads}
            onConflictClick={workspace.handleConflictClick}
          />
        </CollapsibleContent>
      </Collapsible>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        {/* Sidebar */}
        <div className="space-y-2 order-2 lg:order-1">
          <TimetableSidebar
            viewMode={workspace.viewMode}
            teachers={workspace.teacherLoads}
            selectedTeacherId={workspace.selectedTeacherId}
            setSelectedTeacherId={workspace.setSelectedTeacherId}
            onTeacherDragStart={workspace.handleTeacherDragStart}
            onTeacherDragEnd={workspace.handleTeacherDragEnd}
            teacherConstraints={workspace.teacherConstraints}
            entries={workspace.entries}
            batches={workspace.batches}
            selectedBatchId={workspace.selectedBatchId}
            onSelectBatch={workspace.setSelectedBatchId}
          />
        </div>

        {/* Main Grid */}
        <div className="lg:col-span-3 order-1 lg:order-2">
          <TimetableGridSection
            viewMode={workspace.viewMode}
            selectedTeacher={workspace.selectedTeacher}
            selectedBatch={workspace.selectedBatch}
            entries={workspace.entries}
            periodStructure={workspace.defaultPeriodStructure}
            onCellClick={workspace.handleCellClick}
            getTeacherConflict={workspace.getTeacherConflict}
            getBatchConflict={workspace.getBatchConflict}
            onDrop={workspace.handleDrop}
            onEntryDragStart={workspace.handleEntryDragStart}
            onEntryDragEnd={workspace.handleEntryDragEnd}
            isDragging={workspace.isDragging}
            draggedEntry={workspace.draggedEntry}
            holidays={workspace.holidays}
            weekStartDate={workspace.currentWeekStart}
            examBlocks={examBlocks}
            selectedBatchId={workspace.selectedBatchId}
          />
        </div>
      </div>

      {/* Assignment Dialog */}
      {workspace.dialogContext && (
        <AssignmentDialog
          open={workspace.dialogOpen}
          onClose={workspace.closeDialog}
          day={workspace.dialogContext.day}
          period={workspace.dialogContext.period}
          viewMode={workspace.viewMode}
          selectedTeacher={workspace.selectedTeacher}
          selectedBatch={workspace.selectedBatch}
          teachers={workspace.teacherLoads}
          batches={workspace.batches}
          existingEntry={workspace.dialogContext.existingEntry}
          onAssign={workspace.handleAssign}
          onRemove={workspace.dialogContext.existingEntry ? () => workspace.handleRemoveEntry(workspace.dialogContext!.existingEntry!.id) : undefined}
          getTeacherConflict={(tid, d, p) => workspace.entries.some(e => e.teacherId === tid && e.day === d && e.periodNumber === p)}
          getBatchConflict={(bid, d, p) => workspace.entries.some(e => e.batchId === bid && e.day === d && e.periodNumber === p)}
          teacherConstraints={workspace.teacherConstraints}
          facilities={workspace.facilities}
          getTeacherDayPeriods={(tid, d) => workspace.entries.filter(e => e.teacherId === tid && e.day === d).length}
          getFacilityConflict={(fid, d, p) => !!workspace.entries.find(e => e.facilityId === fid && e.day === d && e.periodNumber === p)}
        />
      )}

      {/* Batch Picker Dialog for multi-batch teachers */}
      <BatchPickerDialog
        open={workspace.batchPickerOpen}
        onClose={workspace.closeBatchPicker}
        teacher={workspace.pendingDrop?.teacher || null}
        day={workspace.pendingDrop?.day || ''}
        period={workspace.pendingDrop?.period || 0}
        onSelectBatch={workspace.handleBatchSelect}
        getBatchConflict={(batchId) => workspace.pendingDrop ? workspace.checkBatchConflictAtSlot(batchId, workspace.pendingDrop.day, workspace.pendingDrop.period) : false}
      />

      {/* Holiday Calendar Dialog */}
      <HolidayCalendarDialog
        open={workspace.holidayDialogOpen}
        onClose={() => workspace.setHolidayDialogOpen(false)}
        holidays={workspace.holidays}
        onSave={(newHolidays) => {
          workspace.setHolidays(newHolidays);
          toast.success("Holidays saved", { description: `${newHolidays.length} holidays configured` });
        }}
      />

      {/* Copy Week Dialog */}
      <CopyWeekDialog
        open={workspace.copyWeekDialogOpen}
        onClose={() => workspace.setCopyWeekDialogOpen(false)}
        sourceWeekStart={workspace.currentWeekStart}
        entries={
          workspace.viewMode === 'teacher' && workspace.selectedTeacher
            ? workspace.entries.filter(e => e.teacherId === workspace.selectedTeacher!.teacherId)
            : workspace.viewMode === 'batch' && workspace.selectedBatchId
              ? workspace.entries.filter(e => e.batchId === workspace.selectedBatchId)
              : workspace.entries
        }
        holidays={workspace.holidays}
        onCopy={workspace.handleCopyWeek}
      />
    </div>
  );
};

export default Timetable;
