import { Pipe, PipeTransform } from '@angular/core';
import { NoChangesMessage } from 'src/app/core/global-constants';
import {
  CategoryChange,
  MenuChanges,
} from 'src/app/grubbrr/core/models/menusync.model';

@Pipe({
  name: 'menusyncdisplay',
})
export class MenuSyncDisplayPipe implements PipeTransform {
  transform(menuChanges: MenuChanges, status: string): string {
    if (menuChanges.isFullImport) {
      return 'Full Import';
    }

    var formattedString = '';

    formatText(
      menuChanges.addedCategories,
      menuChanges.addedCategories?.length > 1 ? 'categorie' : 'category',
      'added'
    );
    formatText(
      menuChanges.updatedCategories,
      menuChanges.updatedCategories?.length > 1 ? 'categorie' : 'category',
      'updated'
    );
    formatText(
      menuChanges.removedCategories,
      menuChanges.removedCategories?.length > 1 ? 'categorie' : 'category',
      'removed'
    );

    formatText(menuChanges.addedModifiers, 'modifier', 'added');
    formatText(menuChanges.updatedModifiers, 'modifier', 'updated');
    formatText(menuChanges.removedModifiers, 'modifier', 'removed');

    formatText(menuChanges.addedModifierGroups, 'modifier group', 'added');
    formatText(menuChanges.updatedModifierGroups, 'modifier group', 'updated');
    formatText(menuChanges.removedModifierGroups, 'modifier group', 'removed');

    formatText(menuChanges.addedMenuItems, 'item', 'added');
    formatText(menuChanges.updatedMenuItems, 'item', 'updated');
    formatText(menuChanges.removedMenuItems, 'item', 'removed');

    if (
      menuChanges.isFullImport === false &&
      formattedString === '' &&
      status.toLocaleLowerCase() === 'success'
    ) {
      return NoChangesMessage;
    }

    return formattedString;

    function formatText(
      changes: CategoryChange[],
      label: string,
      action: string
    ) {
      if (changes && changes.length > 0) {
        formattedString += `${changes.length} ${label}${
          changes.length > 1 ? 's' : ''
        } ${action} `;
      }
    }
  }
}
