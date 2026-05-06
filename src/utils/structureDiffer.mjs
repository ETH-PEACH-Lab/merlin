/**
 * Compares consecutive snapshots' models to compute deltas.
 * Tracks which variables are new, changed, or removed.
 * Generates DSL update commands.
 */

export class SnapshotDelta {
  constructor(initializedVariables = new Set()) {
    this.newVariables = [];
    this.changedVariables = [];
    this.removedVariables = [];
    this.unchangedVariables = [];
    this.initializedVariables = initializedVariables;
  }

  hasChanges() {
    return (
      this.newVariables.length > 0 ||
      this.changedVariables.length > 0 ||
      this.removedVariables.length > 0
    );
  }

  getDSLCommands() {
    const commands = [];

    this.newVariables.forEach(({ varName, model }) => {
      commands.push({
        type: 'declaration',
        varName,
        command: model.toDSLDeclaration(),
      });
    });

    this.changedVariables.forEach(({ varName, model, previousModel }) => {
      const updates = model.toDSLUpdates(previousModel);
      updates.forEach((update) => {
        commands.push({
          type: 'update',
          varName,
          command: update,
        });
      });
    });

    return commands;
  }
}


export function computeDelta(currentModels, previousModels, initializedVariables = new Set()) {
  const delta = new SnapshotDelta(initializedVariables);

  if (!previousModels || previousModels.size === 0) {
    currentModels.forEach((model, varName) => {
      if (initializedVariables.has(varName)) {
        delta.changedVariables.push({ varName, model, previousModel: null });
      } else {
        delta.newVariables.push({ varName, model });
      }
    });
    return delta;
  }

  currentModels.forEach((model, varName) => {
    if (!previousModels.has(varName)) {
      delta.newVariables.push({ varName, model });
    } else {
      const previousModel = previousModels.get(varName);
      if (hasModelChanged(model, previousModel)) {
        delta.changedVariables.push({ varName, model, previousModel });
      } else {
        delta.unchangedVariables.push({ varName, model });
      }
    }
  });

  previousModels.forEach((model, varName) => {
    if (!currentModels.has(varName)) {
      delta.removedVariables.push(varName);
    }
  });

  return delta;
}


export function hasModelChanged(currentModel, previousModel) {
  
  if (currentModel.type !== previousModel.type) {
    return true;
  }

  if (
    (currentModel.type === 'list' || currentModel.type === 'stack') &&
    currentModel.elements
  ) {
    if (currentModel.elements.length !== previousModel.elements.length) {
      return true;
    }

    for (let i = 0; i < currentModel.elements.length; i++) {
      const curr = currentModel.elements[i];
      const prev = previousModel.elements[i];

      if (!prev) return true;

      const currVal = curr.value?.value ?? curr.value;
      const prevVal = prev.value?.value ?? prev.value;

      if (currVal !== prevVal) {
        return true;
      }
    }
  }

if (currentModel.type === 'tree' || currentModel.type === 'graph') {
      if (currentModel.nodes.size !== previousModel.nodes.size) {
        return true;
      }

      for (const [nodeId, node] of currentModel.nodes) {
        const prevNode = previousModel.nodes.get(nodeId);
        if (!prevNode || prevNode.value !== node.value) {
          return true;
        }
      }

      if (currentModel.type === 'tree') {
        const currentEdges = new Set(currentModel.edges.map(e => `${e.parent}-${e.child}`));
        const prevEdges = new Set(previousModel.edges.map(e => `${e.parent}-${e.child}`));
        if (currentEdges.size !== prevEdges.size) {
          return true;
        }
        for (const edge of currentEdges) {
          if (!prevEdges.has(edge)) {
          return true;
        }
      }
    }

    if (currentModel.type === 'graph') {
      if (currentModel.edges.length !== previousModel.edges.length) {
        return true;
      }
    }
  }

  if (currentModel.type === 'text') {
    if (currentModel.displayValue !== previousModel.displayValue) {
      return true;
    }
  }

  return false;
}


export function mergeDelta(deltas) {
  const merged = new SnapshotDelta();

  deltas.forEach((delta) => {
    merged.newVariables.push(...delta.newVariables);
    merged.changedVariables.push(...delta.changedVariables);
    merged.removedVariables.push(...delta.removedVariables);
    merged.unchangedVariables.push(...delta.unchangedVariables);
  });

  return merged;
}


export function deltaToString(delta) {
  const lines = [];

  lines.push('=== Delta Report ===');

  if (delta.newVariables.length > 0) {
    lines.push(`\nNew Variables (${delta.newVariables.length}):`);
    delta.newVariables.forEach(({ varName, model }) => {
      lines.push(`  - ${varName}: ${model.type}`);
    });
  }

  if (delta.changedVariables.length > 0) {
    lines.push(`\nChanged Variables (${delta.changedVariables.length}):`);
    delta.changedVariables.forEach(({ varName, model }) => {
      lines.push(`  - ${varName}: ${model.type}`);
    });
  }

  if (delta.removedVariables.length > 0) {
    lines.push(`\nRemoved Variables (${delta.removedVariables.length}):`);
    delta.removedVariables.forEach((varName) => {
      lines.push(`  - ${varName}`);
    });
  }

  if (delta.unchangedVariables.length > 0) {
    lines.push(`\nUnchanged Variables (${delta.unchangedVariables.length}):`);
    delta.unchangedVariables.forEach(({ varName, model }) => {
      lines.push(`  - ${varName}: ${model.type}`);
    });
  }

  return lines.join('\n');
}
