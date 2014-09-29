import os
import pkg_resources
from xml.sax.saxutils import escape

def load_resource(resource_path):
    """
    Gets the content of a resource
    """
    resource_content = pkg_resources.resource_string(__name__, resource_path)
    return unicode(resource_content)


def make_scenario_from_data(data, display_name, question_text, completed):
    return """
<vertical_demo>
    <drag-and-drop-v2
        display_name='{display_name}' question_text='{question_text}'
        weight='1' completed='{completed}'
        data='{data}'
    />
</vertical_demo>
""".format(data=escape(data), display_name=display_name, question_text=question_text, completed=completed)

def format_name(raw_name):
    return raw_name.replace('_', ' ').title()


def get_scenarios_from_path(scenarios_path, include_identifier=False):
    """
    Returns an array of (title, xmlcontent) from files contained in a specified directory,
    formatted as expected for the return value of the workbench_scenarios() method
    """
    base_fullpath = os.path.dirname(os.path.realpath(__file__))
    scenarios_fullpath = os.path.join(base_fullpath, scenarios_path)

    scenarios = []
    if os.path.isdir(scenarios_fullpath):
        for template in os.listdir(scenarios_fullpath):
            if not template.endswith('.json'):
                continue
            identifier, title, scenario = get_scenario_from_file(template, scenarios_path)
            if not include_identifier:
                scenarios.append((title, scenario))
            else:
                scenarios.append((identifier, title, scenario))

    return scenarios


def get_scenario_from_file(filename, scenarios_path):
    identifier = filename[:-5]
    block_title, question_text = map(format_name, identifier.split('-'))
    title = identifier.replace('_', ' ').replace('-', ' ').title()
    scenario_file = os.path.join(scenarios_path, filename)
    scenario = make_scenario_from_data(scenario_file, block_title, question_text, False)
    return identifier, title, scenario


def load_scenarios_from_path(scenarios_path):
    """
    Load all xml files contained in a specified directory, as workbench scenarios
    """
    return get_scenarios_from_path(scenarios_path, include_identifier=True)