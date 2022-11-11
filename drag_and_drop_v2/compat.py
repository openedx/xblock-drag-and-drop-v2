"""
Compatibility layer to isolate core-platform waffle flags from implementation.
"""

# Waffle flags configuration

# Namespace
WAFFLE_NAMESPACE = "drag_and_drop_v2"

# Course Waffle Flags
# .. toggle_name: drag_and_drop_v2.enable_alternative_grading
# .. toggle_implementation: CourseWaffleFlag
# .. toggle_default: False
# .. toggle_description: Enables alternative grading for the xblock
#    that does not include decoy items in the score.
# .. toggle_use_cases: open_edx
# .. toggle_creation_date: 2022-11-10
# .. toggle_tickets: <>
# .. toggle_warning: None.
ENABLE_ALTERNATIVE_GRADING = 'enable_alternative_grading'


def get_config_waffle_flag():
    """
    Import and return Waffle flag for enabling alternative grading for drag_and_drop_v2 Xblock.
    """
    # pylint: disable=import-error,import-outside-toplevel
    from openedx.core.djangoapps.waffle_utils import CourseWaffleFlag
    return CourseWaffleFlag(f'{WAFFLE_NAMESPACE}.{ENABLE_ALTERNATIVE_GRADING}', __name__)
