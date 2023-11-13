import {Names, Name as NameT, CustomNames} from '../../../types/names';
import {MessageUtils} from './messageUtils';

export class Name {
  private static getPosition(role: string, names: CustomNames) {
    let position: NameT['position'] | undefined = names?.[role]?.position;
    if (role !== MessageUtils.USER_ROLE) position ??= names?.ai?.position;
    position ??= names?.default?.position;
    position ??= role === MessageUtils.USER_ROLE ? 'right' : 'left';
    return position;
  }

  private static applyStyle(element: HTMLElement, role: string, names: CustomNames) {
    Object.assign(element.style, names.default?.style);
    if (role === MessageUtils.USER_ROLE) {
      Object.assign(element.style, names.user?.style);
    } else {
      Object.assign(element.style, names.ai?.style);
      Object.assign(element.style, names[role]?.style);
    }
  }

  private static getNameText(role: string, names: CustomNames) {
    if (role === MessageUtils.USER_ROLE) {
      return names.user?.text || names.default?.text || 'User';
    }
    return names[role]?.text || names.ai?.text || names.default?.text || 'AI';
  }

  private static createName(role: string, names: CustomNames) {
    const element = document.createElement('div');
    element.classList.add('name');
    element.textContent = Name.getNameText(role, names);
    Name.applyStyle(element, role, names);
    return element;
  }

  public static add(messageText: HTMLElement, role: string, names: Names) {
    const customConfig = typeof names === 'boolean' ? {} : names;
    const nameElement = Name.createName(role, customConfig);
    const position = Name.getPosition(role, customConfig);
    nameElement.classList.add(position === 'left' ? 'left-item-position' : 'right-item-position');
    messageText.insertAdjacentElement(position === 'left' ? 'beforebegin' : 'afterend', nameElement);
  }
}
