# HR Workflow Designer Prototype

Mini HR workflow designer built with React, TypeScript, Zustand, and React Flow.

## What This Prototype Covers

- Drag-and-drop workflow canvas using React Flow.
- Custom node types: `start`, `task`, `approval`, `automatedStep`, `end`.
- Node-specific configuration panel with controlled forms.
- Mock API layer for:
  - `GET /automations` (mock automation action definitions)
  - `POST /simulate` (mock workflow simulation)
- Validation + simulation sandbox with execution timeline.

## Tech Stack

- React + Vite + TypeScript
- React Flow
- Zustand
- React Hook Form

## Run Locally

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

## Scripts

- `npm run dev` - start dev server
- `npm run build` - type-check + production build
- `npm run lint` - ESLint checks
- `npm run preview` - preview production build

## Architecture

```
src/
  api/
    mockApi.ts                  # mock GET /automations, POST /simulate behavior
  components/
    canvas/                     # React Flow wrapper + interactions
    forms/                      # node-specific edit forms
    nodes/                      # custom node renderer
    panels/                     # edit panel + simulation panel
    sidebar/                    # draggable node palette
  hooks/
    useNodeManagement.ts        # reusable node/workflow operations
  store/
    workflowStore.ts            # central state (workflows, selection, validation, simulation)
  types/
    workflow.ts                 # shared interfaces/types
  utils/
    nodeUtils.ts                # defaults + labels + node validation helpers
```

### Design Choices

- **Zustand for state**: minimal boilerplate and easy store composition.
- **Form-per-node-type**: scalable structure for adding new node types.
- **Mock API abstraction**: keeps UI code decoupled from backend details.
- **Strong typing**: node data shapes are explicit and extensible.

## Functional Notes

### Canvas

- Drag nodes from sidebar into the canvas.
- Connect nodes via edges.
- Select node to edit properties.
- Right-click node or edge to delete.
- Includes minimap, controls, and background grid.

### Node Form Panel

Each node type has a dedicated form:

- `Start`: start title + optional metadata key/value list
- `Task`: title, description, assignee, due date, optional custom fields
- `Approval`: title, approver role, auto-approve threshold
- `Automated Step`: title, action picker, dynamic action params
- `End`: end message, summary flag

### Validation

Current validation checks:

- Workflow has a start node.
- Workflow has an end node.
- Detects cycles.
- Detects disconnected non-start nodes.
- Warns if start is not the first created node.

### Simulation Sandbox

- Validates workflow before simulation.
- Serializes current graph to mock simulation API.
- Displays result status + step-by-step execution timeline.

## Mock API Contract

### `GET /automations` (simulated by `mockApi.getAutomations`)

Example:

```json
[
  { "id": "send_email", "label": "Send Email", "params": ["to", "subject", "body"] },
  { "id": "generate_doc", "label": "Generate Document", "params": ["template", "recipient", "format"] }
]
```

### `POST /simulate` (simulated by `mockApi.simulateWorkflow`)

Input: workflow graph (`nodes`, `edges`)  
Output: success/failure + step execution list with timestamps.

## Assumptions

- Prototype scope intentionally avoids auth and persistence.
- Single-user in-memory editing.
- Simulation is deterministic and linear (first outgoing edge path).

## Potential Extensions

- JSON import/export
- Undo/redo
- Node templates
- Visual node-level error badges
- Auto-layout
- Persistent storage via backend
